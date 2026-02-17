"use client";

import React, { useState } from "react";
import { Upload, ChevronDown, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ApplicationForm() {
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Application submitted successfully!");
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
            <div className="brand-dot-blue"></div>
          </div>
          <h1>Gattabara Games Application Form</h1>
          <p className="intro-text">
            Use this form to introduce your project or studio to Gattabara Games. We collaborate with solo creators and independent studios to co-create original games, aligning on vision, authorship, and long-term ownership.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          {/* Studio Info Section */}
          <div className="form-group">
            <label>Studio / Creator Name</label>
            <input
              type="text"
              required
              onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Studio or Portfolio Website</label>
            <p className="field-hint">(If solo creator, link to portfolio or previous work)</p>
            <input
              type="url"
              onChange={(e) => setFormData({ ...formData, studioWebsite: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              required
              onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Your Email Address</label>
            <input
              type="email"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              required
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>

          {/* Project Info Section */}
          <div className="form-group">
            <label>Game / Project Title</label>
            <p className="field-hint">(This can be a working title or internal project codename.)</p>
            <input
              type="text"
              required
              onChange={(e) => setFormData({ ...formData, gameTitle: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>What kind of collaboration are you seeking?</label>
            <p className="field-hint">(Select all that apply)</p>
            <div className="support-info">
              <p><strong>Co-Development Partnership:</strong> Hands-on creative and production collaboration with Gattabara to build the game together.</p>
              <p><strong>Project Co-Funding:</strong> Financial support to help bring your game to life, including development, localisation, marketing, porting, etc.</p>
              <p><strong>Go-To-Market & Publishing Support:</strong> Gattabara supports release, distribution, marketing, and launch strategy while you retain creative authorship.</p>
            </div>
            <div className="select-wrapper">
              <select required onChange={(e) => setFormData({ ...formData, collaborationTypes: [e.target.value] as any })}>
                <option value="">Select an option</option>
                <option value="co-dev">Co-Development Partnership</option>
                <option value="co-funding">Project Co-Funding</option>
                <option value="publishing">Go-To-Market & Publishing Support</option>
              </select>
              <ChevronDown className="select-arrow" size={18} />
            </div>
          </div>

          <div className="form-group">
            <label>Short Project Description</label>
            <p className="field-hint">(Tell us what you’re building, why it matters, and what makes it distinct.)</p>
            <textarea
              required
              maxLength={2000}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
            <span className="char-count">{formData.description.length}/2000</span>
          </div>

          <div className="form-group">
            <label>Total Project Budget (USD)</label>
            <p className="field-hint">(The estimated total cost to ship the project, including any spend to date.)</p>
            <input
              type="text"
              onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Collaboration Budget Ask (USD)</label>
            <p className="field-hint">(How much support are you seeking from Gattabara Games?)</p>
            <input
              type="number"
              required
              onChange={(e) => setFormData({ ...formData, budgetAsk: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Target Platform(s)</label>
            <p className="field-hint">(Select all that apply.)</p>
            <div className="platforms-grid">
              {['Console', 'Mobile', 'PC', 'VR'].map((platform) => (
                <div key={platform} className="checkbox-row" onClick={() => togglePlatform(platform)}>
                  <div className={`custom-checkbox ${formData.platforms.includes(platform as never) ? 'checked' : ''}`}>
                    <Check className="check-icon" size={14} />
                  </div>
                  <span>{platform}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              required
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            />
          </div>

          {/* Comparable Titles Section */}
          <div className="form-group">
            <label>Comparable Title 1</label>
            <p className="field-hint">(Based on gameplay, tone, and scope. Preferably released in the last 10 years.)</p>
            <input
              type="text"
              onChange={(e) => setFormData({ ...formData, compTitle1: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Comparable Title 2</label>
            <input
              type="text"
              onChange={(e) => setFormData({ ...formData, compTitle2: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Comparable Title 3</label>
            <input
              type="text"
              onChange={(e) => setFormData({ ...formData, compTitle3: e.target.value })}
            />
          </div>

          {/* Materials Section */}
          <div className="form-group">
            <label>Playable / Materials</label>
            <p className="field-hint">We prioritize projects with something tangible to experience (playable builds, prototypes, vertical slices, or strong proof of concept. If available, include gameplay footage alongside your build.)</p>
            <div className="upload-area">
              <Upload className="upload-icon" />
              <p><span>Choose a file to upload</span> or drag and drop here</p>
            </div>
          </div>

          <div className="form-group">
            <label>Materials (Links) and/or Access Details</label>
            <p className="field-hint">(Builds may fail to upload. Please include links to playable builds, pitch decks, gameplay videos, and access details here. If sharing Steam keys, please include at least 5 keys.)</p>
            <textarea
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
                onChange={(e) => setFormData({ ...formData, isMultiplayer: e.target.checked })}
              />
              <div className="custom-checkbox">
                <Check className="check-icon" size={14} />
              </div>
            </div>
            <div className="checkbox-text">
              <label htmlFor="multiplayer">Is this a Multiplayer Build?</label>
              <p className="field-hint">(Check the box if the build requires local/online multiplayer.)</p>
            </div>
          </div>

          <div className="form-group">
            <label>Target Launch Window (Quarter / Year)</label>
            <p className="field-hint">(Format: Q1 2026)</p>
            <input
              type="text"
              required
              placeholder="Q1 2026"
              onChange={(e) => setFormData({ ...formData, launchWindow: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Estimated Launch Price (USD)</label>
            <p className="field-hint">(Your current target price at launch. This can evolve.)</p>
            <input
              type="text"
              required
              onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Current Team Size</label>
            <p className="field-hint">(Number of people actively working on the project.)</p>
            <input
              type="text"
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <p className="field-hint">(Anything else we should know about the project, team, or vision.)</p>
            <textarea
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              maxLength={2000}
            ></textarea>
            <span className="char-count">{formData.additionalNotes.length}/2000</span>
          </div>

          <div className="form-group">
            <label>How did you hear about Gattabara Games?</label>
            <p className="field-hint">(Referral, person, event, community, etc. Helps us route your submission internally.)</p>
            <input
              type="text"
              onChange={(e) => setFormData({ ...formData, howHeard: e.target.value })}
            />
          </div>

          <div className="captcha-placeholder">
            <div className="checkbox-row">
              <div className="custom-checkbox"></div>
              <span>I'm not a robot</span>
            </div>
            <div className="recaptcha-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#CCCCCC" />
                <path d="M12 6V12L16 14" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-button">Submit</button>
          </div>
        </form>
      </motion.div>

      <style jsx>{`
        .form-page-container {
          min-height: 100vh;
          background-color: #ffffff;
          display: flex;
          justify-content: center;
          padding: 80px 150px;
          color: #333;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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

        .brand-dot-blue {
          width: 40px;
          height: 40px;
          background: #4A6CF7;
          border-radius: 50%;
          background-image: radial-gradient(circle at 30% 30%, #7e98ff, #4A6CF7);
        }

        h1 {
          font-size: 2.25rem;
          font-weight: 700;
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
          opacity: 0;
          transition: opacity 0.2s;
        }

        .custom-checkbox.checked .check-icon {
          opacity: 1;
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

        .upload-area:hover {
          border-color: #3b82f6;
          background-color: #f9faff;
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

        .captcha-placeholder {
          background-color: #fafafa;
          border: 1px solid #e0e0e0;
          padding: 16px;
          border-radius: 4px;
          width: 300px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }

        .recaptcha-logo {
          opacity: 0.5;
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

        @media (max-width: 640px) {
          .form-card {
            padding: 30px;
          }
          
          h1 {
            font-size: 1.75rem;
          }
          
          .platforms-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
