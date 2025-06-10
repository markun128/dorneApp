import React, { useState, useEffect } from 'react';

const FlightLog = () => {
  const [flightRecords, setFlightRecords] = useState([]);
  const [aircraftList, setAircraftList] = useState([]);
  const [flightData, setFlightData] = useState({
    flightDate: new Date().toISOString().split('T')[0],
    selectedAircraft: '',
    pilotName: '',
    licenseNumber: '',
    flightPurpose: '',
    flightRoute: '',
    takeoffLocation: '',
    takeoffTime: '',
    landingLocation: '',
    landingTime: '',
    flightDuration: '',
    totalFlightTime: '',
    safetyIssues: '',
    malfunctionDetails: '',
    flightAreas: [],
    preFlightInspection: {}
  });

  const flightAreaOptions = [
    { id: 'airportArea', label: '空港等周辺' },
    { id: 'densityArea', label: '人口集中地区' },
    { id: 'highAltitude', label: '地表150m以上' },
    { id: 'nightFlight', label: '夜間飛行' },
    { id: 'visualFlight', label: '目視外飛行' },
    { id: 'crowdArea', label: '人又は物件から30m未満' },
    { id: 'eventArea', label: 'イベント上空' },
    { id: 'hazardousMaterial', label: '危険物輸送' },
    { id: 'dropping', label: '物件投下' }
  ];

  // 国土交通省準拠の飛行前点検項目
  const preFlightInspectionItems = [
    {
      category: '機体外観',
      items: [
        { id: 'visualInspection', label: '機体全体の目視確認（損傷・変形・亀裂の有無）', required: true },
        { id: 'registrationMark', label: '機体登録記号の確認（剥がれ・損傷の有無）', required: true },
        { id: 'propellers', label: 'プロペラの損傷・変形・取付確認', required: true },
        { id: 'gimbalCamera', label: 'ジンバル・カメラの動作確認', required: false }
      ]
    },
    {
      category: 'バッテリー・電源',
      items: [
        { id: 'batteryLevel', label: 'バッテリー残量確認（70%以上）', required: true },
        { id: 'batteryCondition', label: 'バッテリーの膨張・損傷確認', required: true },
        { id: 'controllerBattery', label: '送信機バッテリー残量確認', required: true }
      ]
    },
    {
      category: 'システム・機能',
      items: [
        { id: 'gnssSignal', label: 'GNSS受信状況確認', required: true },
        { id: 'returnToHome', label: 'リターントゥホーム機能確認', required: true },
        { id: 'remoteId', label: 'リモートID機能確認', required: true },
        { id: 'compassCalibration', label: 'コンパスキャリブレーション実施', required: false }
      ]
    },
    {
      category: '操縦装置',
      items: [
        { id: 'controllerOperation', label: '送信機各操作スティック動作確認', required: true },
        { id: 'emergencyStop', label: '緊急停止機能確認', required: true },
        { id: 'displayScreen', label: '画面表示・データリンク確認', required: true }
      ]
    },
    {
      category: '飛行環境',
      items: [
        { id: 'weatherCondition', label: '気象条件確認（風速・雨・霧等）', required: true },
        { id: 'flightArea', label: '飛行空域の安全確認', required: true },
        { id: 'obstacles', label: '周辺障害物の確認', required: true },
        { id: 'noFlyZone', label: '飛行禁止区域の再確認', required: true }
      ]
    }
  ];

  useEffect(() => {
    loadData();
    loadAircraftList();
  }, []);

  const loadData = () => {
    try {
      const saved = localStorage.getItem('droneFlightRecords');
      if (saved) {
        setFlightRecords(JSON.parse(saved));
      }
    } catch (error) {
      console.error('飛行記録の読み込みに失敗しました:', error);
    }
  };

  const loadAircraftList = () => {
    try {
      // 既存の機体情報を読み込み（現在は単一機体のみ対応）
      const savedAircraft = localStorage.getItem('droneAircraftInfo');
      if (savedAircraft) {
        const aircraft = JSON.parse(savedAircraft);
        if (aircraft.registrationNumber) {
          setAircraftList([aircraft]);
          // 機体が1つしかない場合は自動選択
          if (!flightData.selectedAircraft) {
            setFlightData(prev => ({
              ...prev,
              selectedAircraft: aircraft.registrationNumber
            }));
          }
        }
      }
    } catch (error) {
      console.error('機体情報の読み込みに失敗しました:', error);
    }
  };

  const saveFlightRecords = (records) => {
    try {
      localStorage.setItem('droneFlightRecords', JSON.stringify(records));
    } catch (error) {
      console.error('飛行記録の保存に失敗しました:', error);
      alert('データの保存に失敗しました');
    }
  };

  const handleFlightDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'flightAreas') {
        setFlightData(prev => ({
          ...prev,
          flightAreas: checked 
            ? [...prev.flightAreas, value]
            : prev.flightAreas.filter(area => area !== value)
        }));
      } else if (name === 'preFlightInspection') {
        setFlightData(prev => ({
          ...prev,
          preFlightInspection: {
            ...prev.preFlightInspection,
            [value]: checked
          }
        }));
      }
    } else {
      setFlightData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateFlightData = (data) => {
    if (!data.selectedAircraft) {
      alert('使用する無人航空機を選択してください');
      return false;
    }
    
    // 必須点検項目の確認
    const requiredInspectionItems = preFlightInspectionItems
      .flatMap(category => category.items.filter(item => item.required))
      .map(item => item.id);
    
    const completedInspectionItems = Object.keys(data.preFlightInspection)
      .filter(key => data.preFlightInspection[key] === true);
    
    const missingRequiredItems = requiredInspectionItems.filter(
      itemId => !completedInspectionItems.includes(itemId)
    );
    
    if (missingRequiredItems.length > 0) {
      alert('必須の飛行前点検項目がすべて完了していません。赤い印のついた項目をすべて確認してください。');
      return false;
    }
    
    if (!data.flightDate || !data.pilotName || !data.flightPurpose || 
        !data.takeoffLocation || !data.takeoffTime || !data.landingLocation || 
        !data.landingTime || !data.flightDuration || !data.totalFlightTime) {
      alert('必須項目をすべて入力してください');
      return false;
    }
    
    if (data.takeoffTime >= data.landingTime) {
      alert('着陸時刻は離陸時刻より後の時間を入力してください');
      return false;
    }
    
    return true;
  };

  const handleFlightSubmit = (e) => {
    e.preventDefault();
    
    if (validateFlightData(flightData)) {
      // 選択された機体情報を取得
      const selectedAircraftInfo = aircraftList.find(aircraft => 
        aircraft.registrationNumber === flightData.selectedAircraft
      );
      
      const newRecord = {
        id: Date.now(),
        ...flightData,
        aircraftInfo: selectedAircraftInfo, // 機体情報を記録に含める
        flightDuration: parseInt(flightData.flightDuration),
        totalFlightTime: parseInt(flightData.totalFlightTime),
        safetyIssues: flightData.safetyIssues || '特に問題なし',
        malfunctionDetails: flightData.malfunctionDetails || 'なし',
        createdAt: new Date().toLocaleString('ja-JP')
      };
      
      const updatedRecords = [newRecord, ...flightRecords];
      setFlightRecords(updatedRecords);
      saveFlightRecords(updatedRecords);
      
      // フォームをリセット（機体選択は保持）
      setFlightData({
        flightDate: new Date().toISOString().split('T')[0],
        selectedAircraft: flightData.selectedAircraft, // 機体選択は保持
        pilotName: '',
        licenseNumber: '',
        flightPurpose: '',
        flightRoute: '',
        takeoffLocation: '',
        takeoffTime: '',
        landingLocation: '',
        landingTime: '',
        flightDuration: '',
        totalFlightTime: '',
        safetyIssues: '',
        malfunctionDetails: '',
        flightAreas: [],
        preFlightInspection: {} // 点検結果もリセット
      });
      
      alert('飛行記録を追加しました');
    }
  };

  const exportToCsv = () => {
    if (flightRecords.length === 0) {
      alert('エクスポートする飛行記録がありません');
      return;
    }
    
    const headers = [
      '飛行年月日', '機体登録記号', '機体種類', '機体型式', '操縦者氏名', '技能証明書番号', 
      '飛行目的', '飛行経路', '離陸場所', '離陸時刻', '着陸場所', '着陸時刻', 
      '飛行時間(分)', '製造後総飛行時間(分)', '飛行禁止空域・飛行方法', 
      '飛行前点検実施状況', '安全に影響のあった事項', '不具合・対応', '記録作成日時'
    ];
    
    const csvContent = [
      headers.join(','),
      ...flightRecords.map(record => {
        // 点検結果をまとめる
        const inspectionStatus = record.preFlightInspection 
          ? Object.keys(record.preFlightInspection).filter(key => record.preFlightInspection[key]).length + '項目完了'
          : '点検記録なし';
        
        return [
          record.flightDate,
          `"${record.aircraftInfo?.registrationNumber || record.selectedAircraft || ''}"`,
          `"${record.aircraftInfo?.aircraftType || ''}"`,
          `"${record.aircraftInfo?.model || ''}"`,
          `"${record.pilotName}"`,
          `"${record.licenseNumber || ''}"`,
          `"${record.flightPurpose}"`,
          `"${record.flightRoute || ''}"`,
          `"${record.takeoffLocation}"`,
          record.takeoffTime,
          `"${record.landingLocation}"`,
          record.landingTime,
          record.flightDuration,
          record.totalFlightTime,
          `"${record.flightAreas.join(', ')}"`,
          `"${inspectionStatus}"`,
          `"${record.safetyIssues}"`,
          `"${record.malfunctionDetails}"`,
          `"${record.createdAt}"`
        ].join(',');
      })
    ].join('\n');
    
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `drone_flight_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAllRecords = () => {
    if (window.confirm('すべての飛行記録を削除しますか？この操作は取り消せません。')) {
      setFlightRecords([]);
      saveFlightRecords([]);
      alert('すべての飛行記録を削除しました');
    }
  };

  return (
    <div className="page-content">
      {/* 飛行記録入力セクション */}
      <section className="form-section">
        <h2>飛行記録の入力</h2>
        <p className="section-description">
          各飛行毎の詳細な記録を入力してください。すべての必須項目の入力が必要です。
        </p>
        
        <form onSubmit={handleFlightSubmit}>
          {/* 飛行前点検セクション */}
          <div className="checkbox-group" style={{backgroundColor: '#fff3cd', borderColor: '#ffeeba'}}>
            <h3 style={{color: '#856404', marginBottom: '15px'}}>
              <span style={{color: '#dc3545'}}>★</span> 飛行前点検（必須）
            </h3>
            <p style={{color: '#856404', marginBottom: '20px', fontSize: '14px'}}>
              飛行前に以下の点検項目をすべて確認してください。赤い印（<span style={{color: '#dc3545'}}>★</span>）は必須項目です。
            </p>
            
            {preFlightInspectionItems.map((category, categoryIndex) => (
              <div key={categoryIndex} style={{marginBottom: '25px'}}>
                <h4 style={{
                  color: '#495057', 
                  marginBottom: '12px', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  borderBottom: '2px solid #dee2e6',
                  paddingBottom: '5px'
                }}>
                  {category.category}
                </h4>
                <div className="checkbox-row" style={{flexDirection: 'column', gap: '8px'}}>
                  {category.items.map((item, itemIndex) => (
                    <label key={itemIndex} className="checkbox-label" style={{
                      minWidth: 'auto',
                      padding: '8px 12px',
                      backgroundColor: flightData.preFlightInspection[item.id] ? '#d4edda' : '#f8f9fa',
                      border: `1px solid ${flightData.preFlightInspection[item.id] ? '#c3e6cb' : '#dee2e6'}`,
                      borderRadius: '6px',
                      transition: 'all 0.3s ease'
                    }}>
                      <input 
                        type="checkbox" 
                        name="preFlightInspection"
                        value={item.id}
                        checked={flightData.preFlightInspection[item.id] || false}
                        onChange={handleFlightDataChange}
                        style={{marginRight: '10px'}}
                      />
                      {item.required && <span style={{color: '#dc3545', marginRight: '5px'}}>★</span>}
                      <span style={{
                        color: flightData.preFlightInspection[item.id] ? '#155724' : '#495057',
                        fontWeight: flightData.preFlightInspection[item.id] ? '600' : 'normal'
                      }}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="selectedAircraft">使用する無人航空機 <span className="required">*</span></label>
              <select 
                name="selectedAircraft" 
                value={flightData.selectedAircraft}
                onChange={handleFlightDataChange}
                required
              >
                <option value="">機体を選択してください</option>
                {aircraftList.map(aircraft => (
                  <option key={aircraft.registrationNumber} value={aircraft.registrationNumber}>
                    {aircraft.registrationNumber} - {aircraft.aircraftType} ({aircraft.model || '型式未設定'})
                  </option>
                ))}
              </select>
              {aircraftList.length === 0 && (
                <small style={{color: '#e74c3c'}}>
                  機体が登録されていません。先に「無人航空機登録」画面で機体情報を登録してください。
                </small>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="flightDate">飛行年月日 <span className="required">*</span></label>
              <input 
                type="date" 
                name="flightDate" 
                value={flightData.flightDate}
                onChange={handleFlightDataChange}
                required 
              />
            </div>
          </div>
          
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="pilotName">操縦者氏名 <span className="required">*</span></label>
              <input 
                type="text" 
                name="pilotName" 
                value={flightData.pilotName}
                onChange={handleFlightDataChange}
                placeholder="山田太郎" 
                required 
              />
            </div>
            <div className="input-group">
              <label htmlFor="licenseNumber">技能証明書番号</label>
              <input 
                type="text" 
                name="licenseNumber" 
                value={flightData.licenseNumber}
                onChange={handleFlightDataChange}
                placeholder="資格保有者のみ入力" 
              />
              <small>無人航空機操縦者技能証明書を保有している場合</small>
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="flightPurpose">飛行の目的 <span className="required">*</span></label>
            <select 
              name="flightPurpose" 
              value={flightData.flightPurpose}
              onChange={handleFlightDataChange}
              required
            >
              <option value="">選択してください</option>
              <option value="趣味">趣味</option>
              <option value="空撮">空撮・写真撮影</option>
              <option value="測量">測量・点検</option>
              <option value="輸送">輸送・配送</option>
              <option value="研究開発">研究開発</option>
              <option value="農薬散布">農薬散布</option>
              <option value="警備">警備・監視</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="flightRoute">飛行経路</label>
            <textarea 
              name="flightRoute" 
              rows="3" 
              value={flightData.flightRoute}
              onChange={handleFlightDataChange}
              placeholder="離陸地点から着陸地点までの具体的な経路を記載（例：公園中央部から半径50m以内を時計回りに飛行）"
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="takeoffLocation">離陸場所 <span className="required">*</span></label>
              <input 
                type="text" 
                name="takeoffLocation" 
                value={flightData.takeoffLocation}
                onChange={handleFlightDataChange}
                placeholder="東京都新宿区〇〇公園" 
                required 
              />
            </div>
            <div className="input-group">
              <label htmlFor="takeoffTime">離陸時刻 <span className="required">*</span></label>
              <input 
                type="time" 
                name="takeoffTime" 
                value={flightData.takeoffTime}
                onChange={handleFlightDataChange}
                required 
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="landingLocation">着陸場所 <span className="required">*</span></label>
              <input 
                type="text" 
                name="landingLocation" 
                value={flightData.landingLocation}
                onChange={handleFlightDataChange}
                placeholder="東京都新宿区〇〇公園" 
                required 
              />
            </div>
            <div className="input-group">
              <label htmlFor="landingTime">着陸時刻 <span className="required">*</span></label>
              <input 
                type="time" 
                name="landingTime" 
                value={flightData.landingTime}
                onChange={handleFlightDataChange}
                required 
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="flightDuration">飛行時間（分） <span className="required">*</span></label>
              <input 
                type="number" 
                name="flightDuration" 
                min="1" 
                value={flightData.flightDuration}
                onChange={handleFlightDataChange}
                placeholder="30" 
                required 
              />
              <small>実際の飛行時間を分単位で入力</small>
            </div>
            <div className="input-group">
              <label htmlFor="totalFlightTime">製造後総飛行時間（分） <span className="required">*</span></label>
              <input 
                type="number" 
                name="totalFlightTime" 
                min="0" 
                value={flightData.totalFlightTime}
                onChange={handleFlightDataChange}
                placeholder="1200" 
                required 
              />
              <small>機体の累積飛行時間</small>
            </div>
          </div>

          <div className="checkbox-group">
            <h3>飛行禁止空域・飛行の方法</h3>
            <p>該当する項目にチェックを入れてください（複数選択可）</p>
            {[0, 1, 2].map(rowIndex => (
              <div key={rowIndex} className="checkbox-row">
                {flightAreaOptions.slice(rowIndex * 3, (rowIndex + 1) * 3).map(option => (
                  <label key={option.id} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      value={option.label}
                      checked={flightData.flightAreas.includes(option.label)}
                      onChange={handleFlightDataChange}
                    /> 
                    {option.label}
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="input-group">
            <label htmlFor="safetyIssues">飛行の安全に影響のあった事項</label>
            <textarea 
              name="safetyIssues" 
              rows="3" 
              value={flightData.safetyIssues}
              onChange={handleFlightDataChange}
              placeholder="問題がなかった場合は「特に問題なし」、問題があった場合は具体的な内容を記載"
            />
          </div>

          <div className="input-group">
            <label htmlFor="malfunctionDetails">不具合・対応</label>
            <textarea 
              name="malfunctionDetails" 
              rows="3" 
              value={flightData.malfunctionDetails}
              onChange={handleFlightDataChange}
              placeholder="機体や設備に不具合があった場合のみ、不具合の内容と対応を記載"
            />
          </div>

          <button type="submit" className="primary-btn">
            飛行記録を追加
          </button>
        </form>
      </section>
      
      {/* 飛行記録一覧セクション */}
      <section className="display-section">
        <h2>飛行記録一覧</h2>
        <div className="export-buttons">
          <button className="export-btn" onClick={exportToCsv}>
            CSV出力
          </button>
          <button className="clear-btn" onClick={clearAllRecords}>
            全記録削除
          </button>
        </div>
        
        <div className="flight-list">
          {flightRecords.length === 0 ? (
            <div className="empty-message">
              飛行記録がありません<br />
              上記のフォームから初回の飛行記録を追加してください
            </div>
          ) : (
            <>
              <div className="records-summary">
                <p>総記録数: <strong>{flightRecords.length}</strong>件</p>
                <p>総飛行時間: <strong>{flightRecords.reduce((total, record) => total + record.flightDuration, 0)}</strong>分</p>
              </div>
              {flightRecords.map(record => (
                <div key={record.id} className="flight-item">
                  <div className="flight-header">
                    <div className="flight-date">{record.flightDate}</div>
                    <div className="flight-duration">{record.flightDuration}分</div>
                  </div>
                  <div className="flight-details">
                    <div className="detail-item">
                      <strong>使用機体:</strong> {record.aircraftInfo?.registrationNumber || record.selectedAircraft || '不明'}
                      {record.aircraftInfo && (
                        <>
                          <br />
                          <strong>機体種類:</strong> {record.aircraftInfo.aircraftType}
                          {record.aircraftInfo.model && (
                            <>
                              <br />
                              <strong>型式:</strong> {record.aircraftInfo.model}
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <div className="detail-item">
                      <strong>操縦者:</strong> {record.pilotName}
                      {record.licenseNumber && (
                        <>
                          <br />
                          <strong>技能証明書:</strong> {record.licenseNumber}
                        </>
                      )}
                    </div>
                    <div className="detail-item">
                      <strong>飛行目的:</strong> {record.flightPurpose}
                    </div>
                    <div className="detail-item">
                      <strong>離陸:</strong> {record.takeoffLocation} ({record.takeoffTime})<br />
                      <strong>着陸:</strong> {record.landingLocation} ({record.landingTime})
                    </div>
                    <div className="detail-item">
                      <strong>製造後総飛行時間:</strong> {record.totalFlightTime}分
                    </div>
                    <div className="detail-item">
                      <strong>飛行禁止空域・飛行方法:</strong><br />
                      {record.flightAreas.length > 0 ? record.flightAreas.join(', ') : 'なし'}
                    </div>
                    <div className="detail-item">
                      <strong>飛行前点検:</strong><br />
                      {record.preFlightInspection ? (() => {
                        const completedItems = Object.keys(record.preFlightInspection).filter(key => record.preFlightInspection[key]).length;
                        const totalRequiredItems = preFlightInspectionItems.flatMap(category => category.items.filter(item => item.required)).length;
                        const allRequiredCompleted = preFlightInspectionItems
                          .flatMap(category => category.items.filter(item => item.required))
                          .every(item => record.preFlightInspection[item.id]);
                        
                        return (
                          <span style={{color: allRequiredCompleted ? '#155724' : '#721c24'}}>
                            {completedItems}項目完了 {allRequiredCompleted ? '✓' : '(必須項目未完了)'}
                          </span>
                        );
                      })() : '点検記録なし'}
                    </div>
                    <div className="detail-item">
                      <strong>飛行経路:</strong><br />
                      {record.flightRoute || '記載なし'}
                    </div>
                    <div className="detail-item">
                      <strong>安全に影響のあった事項:</strong><br />
                      {record.safetyIssues}
                    </div>
                    <div className="detail-item">
                      <strong>不具合・対応:</strong><br />
                      {record.malfunctionDetails}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default FlightLog;