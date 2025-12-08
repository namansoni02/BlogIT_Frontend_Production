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
    <div className="container-twitter">
      <Navbar />
      
      {/* Center Feed */}
      <div className="feed-twitter">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#eff3f4] px-4 py-3">
          <h1 className="text-xl font-bold text-[#0f1419]">Create Post</h1>
        </div>

        {/* Main Form */}
        <div className="p-4 space-y-4">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Title Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[#0f1419] font-semibold text-sm">Title</label>
              <span className={`text-xs ${title.length > TITLE_MAX ? 'text-red-500' : 'text-[#536471]'}`}>
                {title.length}/{TITLE_MAX}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              maxLength={TITLE_MAX}
              className="w-full bg-white border border-[#cfd9de] rounded-lg px-4 py-3 text-[#0f1419] placeholder-[#536471] focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition-colors"
            />
          </div>

          {/* Content Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[#0f1419] font-semibold text-sm">Content</label>
              <span className={`text-xs ${content.length > CONTENT_MAX ? 'text-red-500' : 'text-[#536471]'}`}>
                {content.length}/{CONTENT_MAX}
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={CONTENT_MAX}
              rows={10}
              className="w-full bg-white border border-[#cfd9de] rounded-lg px-4 py-3 text-[#0f1419] placeholder-[#536471] focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition-colors resize-none"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative rounded-lg overflow-hidden border border-[#eff3f4]">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-h-96 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-black/70 rounded-full hover:bg-black transition-colors"
              >
                <X className="text-white" size={18} />
              </button>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-[#1d9bf0]/10 text-[#1d9bf0] px-3 py-1 rounded-full text-sm border border-[#1d9bf0]/20"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-[#1d9bf0]/70 transition-colors"
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
              <div className="flex-1 flex items-center gap-2 bg-white border border-[#cfd9de] rounded-lg px-4 py-2">
                <Hash className="text-[#536471]" size={18} />
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag (max 5)"
                  className="flex-1 bg-transparent text-[#0f1419] placeholder-[#536471] focus:outline-none"
                />
              </div>
              <button
                onClick={addTag}
                disabled={!currentTag.trim()}
                className="px-4 py-2 bg-[#0f1419] hover:bg-[#272c30] disabled:bg-[#536471] disabled:opacity-50 text-white rounded-lg transition-colors font-semibold text-sm"
              >
                Add
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#eff3f4]">
            <div className="flex items-center gap-1">
              {/* Image Upload */}
              <label className="p-2 rounded-lg hover:bg-[#1d9bf0]/10 cursor-pointer transition-colors" title="Add image">
                <Image className="text-[#1d9bf0]" size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              {/* Emoji */}
              <button className="p-2 rounded-lg hover:bg-[#1d9bf0]/10 transition-colors" title="Add emoji">
                <Smile className="text-[#1d9bf0]" size={20} />
              </button>
              
              {/* Mention */}
              <button className="p-2 rounded-lg hover:bg-[#1d9bf0]/10 transition-colors" title="Mention someone">
                <AtSign className="text-[#1d9bf0]" size={20} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={loadDraft}
                className="px-4 py-2 bg-white border border-[#cfd9de] hover:bg-gray-50 text-[#0f1419] rounded-full transition-colors font-semibold text-sm"
              >
                Load Draft
              </button>
              <button
                onClick={saveDraft}
                disabled={!title && !content}
                className="px-4 py-2 bg-white border border-[#cfd9de] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[#0f1419] rounded-full transition-colors font-semibold text-sm"
              >
                Save Draft
              </button>
              <button
                onClick={publishPost}
                disabled={isPublishing || !title.trim() || !content.trim()}
                className="px-5 py-2 bg-[#0f1419] hover:bg-[#272c30] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold transition-all flex items-center gap-2 text-sm"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Tips */}
      <div className="widgets-twitter">
        <div className="card-twitter mt-4">
          <h3 className="text-[#0f1419] font-bold text-lg p-4 pb-3">Writing Tips</h3>
          <div className="px-4 pb-4">
            <ul className="text-[#536471] text-sm space-y-2">
              <li>• Use a clear and engaging title</li>
              <li>• Structure content with paragraphs</li>
              <li>• Add relevant tags</li>
              <li>• Use images when appropriate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
