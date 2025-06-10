import React, { useState, useEffect } from 'react';

const AircraftRegistration = () => {
  const [aircraftInfo, setAircraftInfo] = useState({});

  useEffect(() => {
    loadAircraftInfo();
  }, []);

  const loadAircraftInfo = () => {
    try {
      const saved = localStorage.getItem('droneAircraftInfo');
      if (saved) {
        setAircraftInfo(JSON.parse(saved));
      }
    } catch (error) {
      console.error('機体情報の読み込みに失敗しました:', error);
    }
  };

  const saveAircraftInfo = (info) => {
    try {
      localStorage.setItem('droneAircraftInfo', JSON.stringify(info));
    } catch (error) {
      console.error('機体情報の保存に失敗しました:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const info = {
      registrationNumber: formData.get('registrationNumber'),
      aircraftType: formData.get('aircraftType'),
      model: formData.get('model'),
      manufacturer: formData.get('manufacturer'),
      serialNumber: formData.get('serialNumber'),
      certificationNumber: formData.get('certificationNumber')
    };
    setAircraftInfo(info);
    saveAircraftInfo(info);
    alert('機体情報を保存しました');
  };

  return (
    <div className="page-content">
      <section className="aircraft-info-section">
        <h2>無人航空機の概要</h2>
        <p className="section-description">
          航空法に基づく飛行日誌の記録要件として、無人航空機の基本情報を登録してください。
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="registrationNumber">登録記号 <span className="required">*</span></label>
              <input 
                type="text" 
                name="registrationNumber" 
                defaultValue={aircraftInfo.registrationNumber || ''}
                placeholder="JU0000000000" 
                required
              />
              <small>例: JU123456789A</small>
            </div>
            <div className="input-group">
              <label htmlFor="aircraftType">種類 <span className="required">*</span></label>
              <select name="aircraftType" defaultValue={aircraftInfo.aircraftType || ''} required>
                <option value="">選択してください</option>
                <option value="マルチローター">マルチローター</option>
                <option value="ヘリコプター">ヘリコプター</option>
                <option value="固定翼機">固定翼機</option>
                <option value="VTOL">VTOL（垂直離着陸機）</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>
          
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="model">型式</label>
              <input 
                type="text" 
                name="model" 
                defaultValue={aircraftInfo.model || ''}
                placeholder="DJI Mini 3" 
              />
              <small>例: DJI Mini 3, Phantom 4 Pro</small>
            </div>
            <div className="input-group">
              <label htmlFor="manufacturer">設計製造者 <span className="required">*</span></label>
              <input 
                type="text" 
                name="manufacturer" 
                defaultValue={aircraftInfo.manufacturer || ''}
                placeholder="DJI" 
                required
              />
              <small>例: DJI, Parrot, Autel</small>
            </div>
          </div>
          
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="serialNumber">製造番号 <span className="required">*</span></label>
              <input 
                type="text" 
                name="serialNumber" 
                defaultValue={aircraftInfo.serialNumber || ''}
                placeholder="123456789" 
                required
              />
              <small>機体に記載されている製造番号</small>
            </div>
            <div className="input-group">
              <label htmlFor="certificationNumber">機体認証書番号</label>
              <input 
                type="text" 
                name="certificationNumber" 
                defaultValue={aircraftInfo.certificationNumber || ''}
                placeholder="任意" 
              />
              <small>機体認証を受けている場合のみ</small>
            </div>
          </div>

          {aircraftInfo.registrationNumber && (
            <div className="current-aircraft-info">
              <h3>現在の登録情報</h3>
              <div className="info-grid">
                <div><strong>登録記号:</strong> {aircraftInfo.registrationNumber}</div>
                <div><strong>種類:</strong> {aircraftInfo.aircraftType}</div>
                <div><strong>型式:</strong> {aircraftInfo.model || '未設定'}</div>
                <div><strong>製造者:</strong> {aircraftInfo.manufacturer}</div>
                <div><strong>製造番号:</strong> {aircraftInfo.serialNumber}</div>
                <div><strong>機体認証書番号:</strong> {aircraftInfo.certificationNumber || '未設定'}</div>
              </div>
            </div>
          )}
          
          <button type="submit" className="primary-btn">
            機体情報を保存
          </button>
        </form>
        
        <div className="help-section">
          <h3>ヘルプ</h3>
          <ul>
            <li><strong>登録記号:</strong> 国土交通省に登録した際に発行される記号（JUから始まる12桁）</li>
            <li><strong>種類:</strong> 無人航空機の基本的な飛行方式による分類</li>
            <li><strong>型式:</strong> 製造者が定める機体の型式名</li>
            <li><strong>製造番号:</strong> 製造者が機体に付与した固有の番号</li>
            <li><strong>機体認証:</strong> 一等無人航空機操縦士等の資格に対応した機体の場合</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AircraftRegistration;