import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    pilotLicense: '',
    organization: ''
  });
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!loginData.username || !loginData.password) {
      alert('ユーザー名とパスワードは必須です');
      return false;
    }

    if (loginData.username.length < 3) {
      alert('ユーザー名は3文字以上で入力してください');
      return false;
    }

    if (loginData.password.length < 6) {
      alert('パスワードは6文字以上で入力してください');
      return false;
    }

    if (isRegister) {
      if (!loginData.email || !loginData.fullName) {
        alert('新規登録時はメールアドレスと氏名は必須です');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginData.email)) {
        alert('有効なメールアドレスを入力してください');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isRegister) {
      // 新規登録処理
      const existingUsers = JSON.parse(localStorage.getItem('skylogger_users') || '[]');
      
      if (existingUsers.find(user => user.username === loginData.username)) {
        alert('このユーザー名は既に使用されています');
        return;
      }

      if (existingUsers.find(user => user.email === loginData.email)) {
        alert('このメールアドレスは既に登録されています');
        return;
      }

      const newUser = {
        id: Date.now(),
        username: loginData.username,
        password: loginData.password, // 実際のアプリではハッシュ化が必要
        email: loginData.email,
        fullName: loginData.fullName,
        pilotLicense: loginData.pilotLicense || '',
        organization: loginData.organization || '',
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('skylogger_users', JSON.stringify(existingUsers));
      
      // ログイン状態にする
      localStorage.setItem('skylogger_current_user', JSON.stringify(newUser));
      onLogin(newUser);
      
      alert('アカウントが正常に作成されました！');
    } else {
      // ログイン処理
      const existingUsers = JSON.parse(localStorage.getItem('skylogger_users') || '[]');
      const user = existingUsers.find(u => 
        u.username === loginData.username && u.password === loginData.password
      );

      if (user) {
        // 最終ログイン時刻を更新
        user.lastLogin = new Date().toISOString();
        const updatedUsers = existingUsers.map(u => u.id === user.id ? user : u);
        localStorage.setItem('skylogger_users', JSON.stringify(updatedUsers));
        localStorage.setItem('skylogger_current_user', JSON.stringify(user));
        
        onLogin(user);
      } else {
        alert('ユーザー名またはパスワードが正しくありません');
      }
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setLoginData({
      username: '',
      password: '',
      email: '',
      fullName: '',
      pilotLicense: '',
      organization: ''
    });
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">🚁</div>
            <div className="login-title">
              <h1>SkyLogger Pro</h1>
              <p>Professional Drone Flight Management</p>
            </div>
          </div>
        </div>

        <div className="login-form-container">
          <div className="login-tabs">
            <button 
              className={`login-tab ${!isRegister ? 'active' : ''}`}
              onClick={() => setIsRegister(false)}
            >
              🔐 ログイン
            </button>
            <button 
              className={`login-tab ${isRegister ? 'active' : ''}`}
              onClick={() => setIsRegister(true)}
            >
              📝 新規登録
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                👤 ユーザー名 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleInputChange}
                placeholder="ユーザー名を入力"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                🔑 パスワード <span className="required">*</span>
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  placeholder="パスワードを入力"
                  required
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <small>6文字以上で入力してください</small>
            </div>

            {isRegister && (
              <>
                <div className="form-group">
                  <label htmlFor="email">
                    📧 メールアドレス <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fullName">
                    👨‍✈️ 氏名 <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={loginData.fullName}
                    onChange={handleInputChange}
                    placeholder="山田 太郎"
                    required
                    autoComplete="name"
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
                    value={loginData.pilotLicense}
                    onChange={handleInputChange}
                    placeholder="技能証明書をお持ちの場合は入力"
                    autoComplete="off"
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
                    value={loginData.organization}
                    onChange={handleInputChange}
                    placeholder="会社名・団体名など"
                    autoComplete="organization"
                  />
                </div>
              </>
            )}

            <button type="submit" className="login-submit-btn">
              {isRegister ? '🚀 アカウント作成' : '🔓 ログイン'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isRegister ? 'すでにアカウントをお持ちですか？' : 'アカウントをお持ちでないですか？'}
            </p>
            <button className="toggle-mode-btn" onClick={toggleMode}>
              {isRegister ? 'ログインはこちら' : '新規登録はこちら'}
            </button>
          </div>
        </div>
      </div>

      <div className="login-info">
        <div className="info-card">
          <h3>🛡️ セキュリティ</h3>
          <p>データはローカルストレージに安全に保存されます</p>
        </div>
        <div className="info-card">
          <h3>📊 データ管理</h3>
          <p>個人の飛行記録を安全に管理・エクスポート</p>
        </div>
        <div className="info-card">
          <h3>🌐 MLIT準拠</h3>
          <p>国土交通省の飛行記録要件に完全対応</p>
        </div>
      </div>
    </div>
  );
};

export default Login;