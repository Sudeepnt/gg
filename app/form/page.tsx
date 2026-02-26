"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { Upload, ChevronDown, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getCMSData, saveInquiry } from "../actions/cmsActions";
import { supabase } from "../lib/supabase";

export default function ApplicationForm() {
  const [content, setContent] = useState<any>(null);

  const [formData, setFormData] = useState({
    studioName: "",
    studioWebsite: "",
    yourName: "",
    email: "",
    country: "",
    gameTitle: "",
    collaborationTypes: [],
    description: "",
    totalBudget: "",
    budgetAsk: "",
    platforms: [],
    genre: "",
    compTitle1: "",
    compTitle2: "",
    compTitle3: "",
    materialsLink: "",
    isMultiplayer: false,
    launchWindow: "",
    estimatedPrice: "",
    teamSize: "",
    additionalNotes: "",
    howHeard: "",
    isCaptchaVerified: false,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const cmsData = await getCMSData();
        if (cmsData && cmsData.form) {
          setContent(cmsData.form);
        }
      } catch (error) {
        console.error("Failed to fetch CMS data:", error);
      }
    };
    fetchContent();
  }, []);

  if (!content) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  const labels = content.labels || {};

  const handleFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files);
    const totalCount = selectedFiles.length + newFiles.length;

    if (totalCount > 5) {
      alert("You can only upload up to 5 files.");
      return;
    }

    const currentTotalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
    const newTotalSize = newFiles.reduce((sum, f) => sum + f.size, 0);

    if ((currentTotalSize + newTotalSize) > 50 * 1024 * 1024) {
      alert("Total file size must be under 50MB.");
      return;
    }

    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.isCaptchaVerified) {
      alert("Please verify that you are not a robot.");
      return;
    }

    setStatus('loading');
    setIsUploading(true);
    setErrorMessage("");

    try {
      // 1. Upload files to Supabase
      const uploadedUrls = [];
      let count = 0;
      for (const file of selectedFiles) {
        count++;
        setUploadProgress(`Uploading ${file.name} (${count}/${selectedFiles.length})...`);

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = `applications/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gg-content')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gg-content')
          .getPublicUrl(filePath);

        uploadedUrls.push({ name: file.name, url: publicUrl });
      }

      setUploadProgress("Finalizing submission...");

      // 2. Save inquiry with file URLs
      const result = await saveInquiry({
        name: formData.yourName,
        email: formData.email,
        message: `Studio: ${formData.studioName}\nProject: ${formData.gameTitle}\nDescription: ${formData.description}`,
        fullData: {
          ...formData,
          attachedFiles: uploadedUrls
        }
      });

      if (result.success) {
        setStatus('success');
        setSelectedFiles([]);
      } else {
        throw new Error(result.error || "Failed to save inquiry data.");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setErrorMessage(error.message || "An unexpected error occurred. Please check your connection and try again.");
      setStatus('error');
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform as never)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform as never]
    }));
  };

  return (
    <div className="form-page-container">
      <Link href="/pitch" className="close-button">
        <X size={24} />
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="form-card"
      >
        <div className="form-header">
          <div className="header-top">
            <Image src="/logos/logo1black.png" alt="Logo" width={80} height={80} className="header-logo" />
          </div>
          <h1>{content.title}</h1>
          <p className="intro-text">
            {content.intro}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          {/* Studio Info Section */}
          <div className="form-group">
            <label>{labels.studioName || "Studio / Creator Name"}</label>
            <input
              type="text"
              required
              value={formData.studioName || ""}
              onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.studioWebsite || "Studio or Portfolio Website"}</label>
            <p className="field-hint">{labels.studioWebsiteHint || "(If solo creator, link to portfolio or previous work)"}</p>
            <input
              type="url"
              value={formData.studioWebsite || ""}
              onChange={(e) => setFormData({ ...formData, studioWebsite: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.yourName || "Your Name"}</label>
            <input
              type="text"
              required
              value={formData.yourName || ""}
              onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.email || "Your Email Address"}</label>
            <input
              type="email"
              required
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.country || "Country"}</label>
            <input
              type="text"
              required
              value={formData.country || ""}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>

          {/* Project Info Section */}
          <div className="form-group">
            <label>{labels.gameTitle || "Game / Project Title"}</label>
            <p className="field-hint">{labels.gameTitleHint || "(This can be a working title or internal project codename.)"}</p>
            <input
              type="text"
              required
              value={formData.gameTitle || ""}
              onChange={(e) => setFormData({ ...formData, gameTitle: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.collaboration || "What kind of collaboration are you seeking?"}</label>
            <p className="field-hint">{labels.collaborationHint || "(Select all that apply)"}</p>
            <div className="support-info">
              <p><strong>{labels.collabCoDev || "Co-Development Partnership"}:</strong> {labels.collabCoDevDesc || "Hands-on creative and production collaboration with Gattabara to build the game together."}</p>
              <p><strong>{labels.collabCoFunding || "Project Co-Funding"}:</strong> {labels.collabCoFundingDesc || "Financial support to help bring your game to life, including development, localisation, marketing, porting, etc."}</p>
              <p><strong>{labels.collabPublishing || "Go-To-Market & Publishing Support"}:</strong> {labels.collabPublishingDesc || "Gattabara supports release, distribution, marketing, and launch strategy while you retain creative authorship."}</p>
            </div>
            <div className="select-wrapper">
              <select
                required
                value={formData.collaborationTypes[0] || ""}
                onChange={(e) => setFormData({ ...formData, collaborationTypes: [e.target.value] as any })}
              >
                <option value="">Select an option</option>
                <option value="co-dev">{labels.collabCoDev || "Co-Development Partnership"}</option>
                <option value="co-funding">{labels.collabCoFunding || "Project Co-Funding"}</option>
                <option value="publishing">{labels.collabPublishing || "Go-To-Market & Publishing Support"}</option>
              </select>
              <ChevronDown className="select-arrow" size={18} />
            </div>
          </div>

          <div className="form-group">
            <label>{labels.description || "Short Project Description"}</label>
            <p className="field-hint">{labels.descriptionHint || "(Tell us what you’re building, why it matters, and what makes it distinct.)"}</p>
            <textarea
              required
              maxLength={2000}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
            <span className="char-count">{formData.description.length}/2000</span>
          </div>

          <div className="form-group">
            <label>{labels.totalBudget || "Total Project Budget (USD)"}</label>
            <p className="field-hint">{labels.totalBudgetHint || "(The estimated total cost to ship the project, including any spend to date.)"}</p>
            <input
              type="text"
              value={formData.totalBudget || ""}
              onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.budgetAsk || "Collaboration Budget Ask (USD)"}</label>
            <p className="field-hint">{labels.budgetAskHint || "(How much support are you seeking from Gattabara Games?)"}</p>
            <input
              type="number"
              required
              value={formData.budgetAsk || ""}
              onChange={(e) => setFormData({ ...formData, budgetAsk: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.platforms || "Target Platform(s)"}</label>
            <p className="field-hint">{labels.platformsHint || "(Select all that apply.)"}</p>
            <div className="platforms-grid">
              {['Console', 'Mobile', 'PC', 'VR'].map((platform) => (
                <div key={platform} className="checkbox-row" onClick={() => togglePlatform(platform)}>
                  <div className={`custom-checkbox ${formData.platforms.includes(platform as never) ? 'checked' : ''}`}>
                    {formData.platforms.includes(platform as never) && <Check className="check-icon" size={14} />}
                  </div>
                  <span>{platform}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>{labels.genre || "Genre"}</label>
            <input
              type="text"
              required
              value={formData.genre || ""}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            />
          </div>

          {/* Comparable Titles Section */}
          <div className="form-group">
            <label>{labels.compTitle || "Comparable Title"} 1</label>
            <p className="field-hint">{labels.compTitleHint || "(Based on gameplay, tone, and scope. Preferably released in the last 10 years.)"}</p>
            <input
              type="text"
              value={formData.compTitle1 || ""}
              onChange={(e) => setFormData({ ...formData, compTitle1: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.compTitle || "Comparable Title"} 2</label>
            <input
              type="text"
              value={formData.compTitle2 || ""}
              onChange={(e) => setFormData({ ...formData, compTitle2: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.compTitle || "Comparable Title"} 3</label>
            <input
              type="text"
              value={formData.compTitle3 || ""}
              onChange={(e) => setFormData({ ...formData, compTitle3: e.target.value })}
            />
          </div>

          {/* Materials Section */}
          <div className="form-group">
            <label>{labels.materials || "Playable / Materials"}</label>
            <p className="field-hint">{labels.materialsHint || "We prioritize projects with something tangible to experience (playable builds, prototypes, vertical slices, or strong proof of concept. If available, include gameplay footage alongside your build.)"}</p>

            <div
              className={`upload-area ${selectedFiles.length > 0 ? 'has-files' : ''} ${isDragActive ? 'drag-active' : ''}`}
              onClick={() => document.getElementById('file-upload')?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="upload-icon" />
              <p><span>{labels.chooseFile || "Choose a file to upload"}</span> {labels.dragDrop || "or drag and drop here"}</p>
              <input
                id="file-upload"
                type="file"
                multiple
                hidden
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.zip,.rar,.txt,.jpg,.png,.mp4,.mov"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="selected-files-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="remove-file">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div className="total-size-indicator">
                  Total: {(selectedFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)} MB / 50 MB
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>{labels.materialsLinks || "Materials (Links) and/or Access Details"}</label>
            <p className="field-hint">{labels.materialsLinksHint || "(Builds may fail to upload. Please include links to playable builds, pitch decks, gameplay videos, and access details here. If sharing Steam keys, please include at least 5 keys.)"}</p>
            <textarea
              value={formData.materialsLink || ""}
              onChange={(e) => setFormData({ ...formData, materialsLink: e.target.value })}
              maxLength={2000}
            ></textarea>
            <span className="char-count">{formData.materialsLink.length}/2000</span>
          </div>

          <div className="form-group checkbox-group">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="multiplayer"
                checked={!!formData.isMultiplayer}
                onChange={(e) => setFormData({ ...formData, isMultiplayer: e.target.checked })}
              />
              <div className={`custom-checkbox ${formData.isMultiplayer ? 'checked' : ''}`}>
                {formData.isMultiplayer && <Check className="check-icon" size={14} />}
              </div>
            </div>
            <div className="checkbox-text">
              <label htmlFor="multiplayer">{labels.multiplayer || "Is this a Multiplayer Build?"}</label>
              <p className="field-hint">{labels.multiplayerHint || "(Check the box if the build requires local/online multiplayer.)"}</p>
            </div>
          </div>

          <div className="form-group">
            <label>{labels.launchWindow || "Target Launch Window (Quarter / Year)"}</label>
            <p className="field-hint">{labels.launchWindowHint || "(Format: Q1 2026)"}</p>
            <input
              type="text"
              required
              placeholder={labels.launchWindowHint || "Q1 2026"}
              value={formData.launchWindow || ""}
              onChange={(e) => setFormData({ ...formData, launchWindow: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.estimatedPrice || "Estimated Launch Price (USD)"}</label>
            <p className="field-hint">{labels.estimatedPriceHint || "(Your current target price at launch. This can evolve.)"}</p>
            <input
              type="text"
              required
              value={formData.estimatedPrice || ""}
              onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.teamSize || "Current Team Size"}</label>
            <p className="field-hint">{labels.teamSizeHint || "(Number of people actively working on the project.)"}</p>
            <input
              type="text"
              value={formData.teamSize || ""}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{labels.additionalNotes || "Additional Notes"}</label>
            <p className="field-hint">{labels.additionalNotesHint || "(Anything else we should know about the project, team, or vision.)"}</p>
            <textarea
              value={formData.additionalNotes || ""}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              maxLength={2000}
            ></textarea>
            <span className="char-count">{formData.additionalNotes.length}/2000</span>
          </div>

          <div className="form-group">
            <label>{labels.howHeard || "How did you hear about Gattabara Games?"}</label>
            <p className="field-hint">{labels.howHeardHint || "(Referral, person, event, community, etc. Helps us route your submission internally.)"}</p>
            <input
              type="text"
              value={formData.howHeard || ""}
              onChange={(e) => setFormData({ ...formData, howHeard: e.target.value })}
            />
          </div>

          <div className="recaptcha-box">
            <div className="recaptcha-left">
              <div
                className={`captcha-checkbox-wrapper ${formData.isCaptchaVerified ? 'verified' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, isCaptchaVerified: !prev.isCaptchaVerified }))}
              >
                <div className="captcha-checkbox">
                  {formData.isCaptchaVerified && <Check size={20} className="text-[#00ad00] stroke-[4px]" />}
                </div>
                <span className="captcha-label">{labels.notRobot || "I'm not a robot"}</span>
              </div>
              <p className="recaptcha-msg">
                reCAPTCHA is changing its terms of service.<br />
                <a href="#">Take action.</a>
              </p>
            </div>

            <div className="recaptcha-right">
              <div className="recaptcha-branding">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v4c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l3.46 2c.79-1.43 1.24-3.07 1.24-4.8 0-5.52-4.48-10-10-10z" fill="#4285F4" />
                  <path d="M6 12c0-1.01.25-1.97.7-2.8L3.24 7.2C2.45 8.63 2 10.27 2 12c0 5.52 4.48 10 10 10v-4c-3.31 0-6-2.69-6-6z" fill="#9BA2A6" />
                  <path d="M12 18l-3.46 2C9.33 21.43 10.63 22 12 22s2.67-.57 3.46-2L12 18z" fill="#9BA2A6" />
                </svg>
                <span className="branding-text">reCAPTCHA</span>
                <div className="branding-links">
                  <a href="#">Privacy</a> - <a href="#">Terms</a>
                </div>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button
              type="submit"
              className={`submit-button ${status === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> {labels.submitting || "Submitting..."}
                </span>
              ) : status === 'success' ? (
                <span className="flex items-center gap-2">
                  <Check size={18} /> {labels.submitted || "Submitted!"}
                </span>
              ) : status === 'error' ? (
                labels.tryAgain || "Try Again"
              ) : (
                labels.submit || "Submit"
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-[100] flex flex-col items-center justify-center p-12 text-center"
            >
              <Loader2 className="animate-spin text-blue-600 mb-6" size={50} />
              <h2 className="text-2xl font-bold mb-2">Sending Application</h2>
              <p className="text-gray-500 font-medium">{uploadProgress}</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-white z-[100] flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="text-green-600" size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-4">{labels.successTitle || "Application Received!"}</h2>
              <p className="text-gray-600 mb-8 max-w-md">
                {labels.successMessage || "Thank you for introducing your project. Our team will review your application and get back to you soon."}
              </p>
              <Link
                href="/pitch"
                className="bg-[#111] text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
              >
                {labels.successButton || "Return to Pitch Page"}
              </Link>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-white z-[100] flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <X className="text-red-600" size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Submission Failed</h2>
              <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-8 max-w-md text-sm border border-red-100">
                {errorMessage}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="bg-[#111] text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
              >
                {labels.tryAgain || "Try Again"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        .form-page-container {
          min-height: 100vh;
          background-color: #ffffff;
          display: flex;
          justify-content: center;
          padding: 80px 150px;
          color: #333;
          font-family: var(--font-bai), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          position: relative;
        }

        .close-button {
          position: fixed;
          top: 40px;
          right: 40px;
          width: 48px;
          height: 48px;
          background-color: #555867;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, background-color 0.2s;
          z-index: 100;
        }

        .close-button:hover {
          transform: scale(1.1);
          background-color: #333;
        }

        .form-card {
          background-color: #ffffff;
          width: 100%;
          max-width: 900px;
          border-radius: 12px;
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.12), 
            0 15px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 80px;
          margin-top: 20px;
          position: relative;
          overflow: hidden;
        }

        .form-header {
          margin-bottom: 40px;
        }

        .header-top {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 24px;
        }

        .header-logo {
          object-fit: contain;
        }

        h1 {
          font-family: "NT Brick Sans", sans-serif;
          font-size: 2.25rem;
          font-weight: 400;
          color: #111;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
          text-align: center;
        }

        .intro-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #6a6e7c;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .application-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }

        label {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
        }

        .field-hint {
          font-size: 0.875rem;
          color: #888;
          line-height: 1.4;
        }

        .char-count {
          font-size: 0.75rem;
          color: #aaa;
          align-self: flex-end;
          margin-top: 4px;
        }

        input[type="text"],
        input[type="email"],
        input[type="url"],
        input[type="number"],
        textarea,
        select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 1rem;
          background-color: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.05);
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        select {
          appearance: none;
          padding-right: 40px;
        }

        .select-arrow {
          position: absolute;
          right: 12px;
          pointer-events: none;
          color: #666;
        }

        .support-info {
          background-color: #fcfcfc;
          border: 1px solid #f3f4f6;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 4px 0 8px;
        }

        .support-info p {
          font-size: 0.825rem;
          line-height: 1.5;
          color: #555;
        }

        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 4px;
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-row span {
          font-size: 0.95rem;
          color: #444;
        }

        .custom-checkbox {
          width: 20px;
          height: 20px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          transition: all 0.2s;
        }

        .custom-checkbox.checked {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .check-icon {
          color: #fff;
        }

        .upload-area {
          border: 1.5px dashed #e0e0e0;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background-color 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .upload-area.has-files {
          border-color: #3b82f6;
          background-color: #f9faff;
          padding: 24px;
        }

        .upload-area.drag-active {
          border-color: #3b82f6;
          background-color: #eff6ff;
          border-width: 2px;
        }

        .selected-files-list {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8f9fa;
          padding: 10px 14px;
          border-radius: 6px;
          border: 1px solid #eee;
        }

        .file-name {
          flex: 1;
          font-size: 0.875rem;
          color: #333;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 0.75rem;
          color: #888;
        }

        .remove-file {
          color: #ff4d4f;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .remove-file:hover {
          background: #fff0f0;
        }

        .total-size-indicator {
          font-size: 0.75rem;
          text-align: right;
          color: #888;
          font-weight: 500;
          margin-top: 4px;
        }

        .upload-icon {
          color: #666;
          width: 32px;
          height: 32px;
        }

        .upload-area p {
          font-size: 0.95rem;
          color: #666;
        }

        .upload-area span {
          color: #3b82f6;
          font-weight: 500;
        }

        .checkbox-group {
          flex-direction: row !important;
          align-items: flex-start;
          gap: 16px !important;
        }

        .checkbox-wrapper {
          position: relative;
          width: 20px;
          height: 20px;
          margin-top: 2px;
        }

        input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          z-index: 2;
        }

        .checkbox-text label {
          margin-bottom: 4px;
          display: block;
        }

        .recaptcha-box {
          background-color: #f9f9f9;
          border: 1px solid #d3d3d3;
          padding: 12px 14px 10px 12px;
          border-radius: 3px;
          width: 320px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 10px;
          box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.08);
          user-select: none;
        }

        .recaptcha-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .captcha-checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .captcha-checkbox {
          width: 28px;
          height: 28px;
          background-color: #fff;
          border: 2px solid #c1c1c1;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s;
        }

        .captcha-checkbox-wrapper:hover .captcha-checkbox {
          border-color: #b2b2b2;
        }

        .captcha-label {
          font-family: Roboto, Arial, sans-serif;
          font-size: 14px;
          color: #000;
          font-weight: 400;
        }

        .recaptcha-msg {
          font-size: 8px;
          color: #555;
          margin: 0;
          line-height: 1.2;
          padding-left: 2px;
        }

        .recaptcha-msg a {
          color: #4a90e2;
          text-decoration: none;
        }

        .recaptcha-msg a:hover {
          text-decoration: underline;
        }

        .recaptcha-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 2px;
        }

        .recaptcha-branding {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .branding-text {
          font-size: 10px;
          color: #555;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .branding-links {
          font-size: 8px;
          color: #555;
        }

        .branding-links a {
          color: #555;
          text-decoration: none;
        }

        .branding-links a:hover {
          text-decoration: underline;
        }

        .form-footer {
          margin-top: 40px;
          display: flex;
          justify-content: flex-end;
          padding-top: 24px;
        }

        .submit-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }

        @media (max-width: 768px) {
          .form-page-container {
            padding: 50px 10px 40px !important;
            display: block !important;
          }
          
          .form-card {
            margin-top: 0 !important;
            padding: 30px 15px !important;
            border-radius: 0 !important;
            max-width: 100vw !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }

          .close-button {
            position: absolute !important;
            top: 15px !important;
            left: 15px !important;
            right: auto !important;
            width: 40px !important;
            height: 40px !important;
            background-color: transparent !important;
            color: #000 !important;
            z-index: 999 !important;
          }

          .close-button:hover {
            background-color: rgba(0,0,0,0.2);
          }

          h1 {
            font-size: 1.75rem;
            margin-top: 20px;
          }
          
          .platforms-grid {
            grid-template-columns: 1fr;
          }

          .recaptcha-box {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .recaptcha-right {
            align-items: flex-start;
            padding-left: 10px;
          }
          
          .form-footer {
            justify-content: center;
          }

          .submit-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
