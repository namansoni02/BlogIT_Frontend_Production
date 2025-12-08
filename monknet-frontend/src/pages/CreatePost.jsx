import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Image, Smile, Hash, AtSign, Send, Sparkles } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import {PostEndpoint} from "../api/APIEndpoints.jsx";
/**
 * CreatePost Component
 * 
 * Purpose: UI for creating and publishing new posts
 * 
 * Features:
 * - Title and content input fields
 * - Character counter
 * - Image attachment preview
 * - Tag input
 * - Mention support
 * - Draft save functionality
 * - Publish to backend
 */

export default function CreatePost() {
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');

  // Character limits
  const TITLE_MAX = 100;
  const CONTENT_MAX = 5000;

  /**
   * Handle image upload and preview
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Remove image preview
   */
  const removeImage = () => {
    setImagePreview(null);
  };

  /**
   * Add tag to tags array
   */
  const addTag = () => {
    if (currentTag.trim() && tags.length < 5 && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  /**
   * Remove tag from tags array
   */
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  /**
   * Handle tag input key press (Enter to add)
   */
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const loadDraft = () => {
    let draft = localStorage.getItem('post_draft');
    draft=JSON.parse(draft);
    if(draft){
        setContent(draft.content || '');
        setTitle(draft.title || '');
        setTags(draft.tags || []);
        setImagePreview(draft.imagePreview || null);
    }
    else{
        setError('No draft found');
    }
  }

  /**
   * Save as draft (localStorage for now)
   */
  const saveDraft = () => {
    const draft = {
      title,
      content,
      tags,
      imagePreview,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('post_draft', JSON.stringify(draft));
    alert('Draft saved!');
  };

  /**
   * Publish post to backend
   */
  const publishPost = async () => {
    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setIsPublishing(true);
    setError('');

    try {
      const token = sessionStorage.getItem('token');
      
      const postData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        // Image upload would go here
      };

      const response = await fetch(PostEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify(postData)
      });

      if (response.ok) {
        // Clear draft
        localStorage.removeItem('post_draft');
        // Navigate to dashboard
        alert('Post published successfully!');
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to publish post');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Post creation error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  /**
   * Cancel and go back
   */


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="pt-20 px-6 max-w-4xl mx-auto">
        {/* Main Content - Create Post Form */}
        <div className="w-full">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="text-purple-400" size={28} />
              <h1 className="text-3xl font-bold text-white">Create Post</h1>
            </div>
          </div>

          {/* Main Form */}
          <div className="glass-effect rounded-2xl p-6 space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Title Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-semibold text-lg">Title</label>
                <span className={`text-sm ${title.length > TITLE_MAX ? 'text-red-400' : 'text-gray-400'}`}>
                  {title.length}/{TITLE_MAX}
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a catchy title..."
                maxLength={TITLE_MAX}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Content Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-semibold text-lg">Content</label>
                <span className={`text-sm ${content.length > CONTENT_MAX ? 'text-red-400' : 'text-gray-400'}`}>
                  {content.length}/{CONTENT_MAX}
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts with the world..."
                maxLength={CONTENT_MAX}
                rows={12}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full max-h-96 object-cover rounded-xl"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-purple-100 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input */}
            {tags.length < 5 && (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                  <Hash className="text-gray-400" size={18} />
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add a tag (max 5)"
                    className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={addTag}
                  disabled={!currentTag.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-xl transition-colors"
                >
                  Add
                </button>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                {/* Image Upload */}
                <label className="p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors" title="Add image">
                  <Image className="text-gray-400" size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                
                {/* Emoji (placeholder) */}
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Add emoji">
                  <Smile className="text-gray-400" size={20} />
                </button>
                
                {/* Mention (placeholder) */}
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Mention someone">
                  <AtSign className="text-gray-400" size={20} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={loadDraft}
                  className="px-5 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white rounded-xl transition-colors"
                >
                  Load Draft
                </button>
                <button
                  onClick={saveDraft}
                  disabled={!title && !content}
                  className="px-5 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white rounded-xl transition-colors"
                >
                  Save Draft
                </button>
                <button
                  onClick={publishPost}
                  disabled={isPublishing || !title.trim() || !content.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  {isPublishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Publish
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-6 glass-effect rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="text-purple-400" size={16} />
              Writing Tips
            </h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Use a clear and engaging title to grab attention</li>
              <li>• Structure your content with paragraphs for better readability</li>
              <li>• Add relevant tags to help others discover your post</li>
              <li>• Use images to make your post more visually appealing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
