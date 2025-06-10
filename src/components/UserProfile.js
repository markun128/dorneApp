import React, { useState } from 'react';

const UserProfile = ({ user, onUpdateUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    pilotLicense: user.pilotLicense || '',
    organization: user.organization || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!editData.fullName || !editData.email) {
      alert('氏名とメールアドレスは必須です');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      alert('有効なメールアドレスを入力してください');
      return;
    }

    // ユーザー情報を更新
    const updatedUser = {
      ...user,
      ...editData,
      updatedAt: new Date().toISOString()
    };

    // ローカルストレージの全ユーザー情報を更新
    const existingUsers = JSON.parse(localStorage.getItem('skylogger_users') || '[]');
    const updatedUsers = existingUsers.map(u => u.id === user.id ? updatedUser : u);
    localStorage.setItem('skylogger_users', JSON.stringify(updatedUsers));
    localStorage.setItem('skylogger_current_user', JSON.stringify(updatedUser));

    onUpdateUser(updatedUser);
    setIsEditing(false);
    alert('プロフィールを更新しました');
  };

  const handleCancel = () => {
    setEditData({
      fullName: user.fullName || '',
      email: user.email || '',
      pilotLicense: user.pilotLicense || '',
      organization: user.organization || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      localStorage.removeItem('skylogger_current_user');
      onLogout();
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-icon">👨‍✈️</div>
          <div className="user-status">
            <span className="status-indicator online"></span>
            オンライン
          </div>
        </div>
        <div className="profile-info">
          <h2>{user.fullName || user.username}</h2>
          <p className="username">@{user.username}</p>
          <p className="last-login">最終ログイン: {formatDate(user.lastLogin)}</p>
        </div>
        <div className="profile-actions">
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '✕ キャンセル' : '✏️ 編集'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 ログアウト
          </button>
        </div>
      </div>

      <div className="profile-content">
        {isEditing ? (
          <div className="profile-edit-form">
            <h3>プロフィール編集</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">
                  👨‍✈️ 氏名 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleInputChange}
                  placeholder="山田 太郎"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  📧 メールアドレス <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pilotLicense">
                  🏆 操縦者技能証明書番号
                </label>
                <input
                  type="text"
                  id="pilotLicense"
                  name="pilotLicense"
                  value={editData.pilotLicense}
                  onChange={handleInputChange}
                  placeholder="技能証明書をお持ちの場合は入力"
                />
              </div>

              <div className="form-group">
                <label htmlFor="organization">
                  🏢 所属組織
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={editData.organization}
                  onChange={handleInputChange}
                  placeholder="会社名・団体名など"
                />
              </div>
            </div>

            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>
                💾 保存
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                ✕ キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-display">
            <div className="profile-cards">
              <div className="info-card">
                <h4>📧 連絡先情報</h4>
                <div className="info-item">
                  <strong>メールアドレス:</strong> {user.email || '未設定'}
                </div>
              </div>

              <div className="info-card">
                <h4>🏆 資格情報</h4>
                <div className="info-item">
                  <strong>操縦者技能証明書:</strong> {user.pilotLicense || '未登録'}
                </div>
                <div className="info-item">
                  <strong>所属組織:</strong> {user.organization || '未設定'}
                </div>
              </div>

              <div className="info-card">
                <h4>📊 アカウント情報</h4>
                <div className="info-item">
                  <strong>ユーザーID:</strong> {user.username}
                </div>
                <div className="info-item">
                  <strong>登録日:</strong> {formatDate(user.registeredAt)}
                </div>
                <div className="info-item">
                  <strong>最終更新:</strong> {user.updatedAt ? formatDate(user.updatedAt) : '未更新'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;