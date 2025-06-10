import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [aircraftInfo, setAircraftInfo] = useState(null);
  const [flightRecords, setFlightRecords] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // 機体情報を読み込み
      const savedAircraft = localStorage.getItem('droneAircraftInfo');
      if (savedAircraft) {
        setAircraftInfo(JSON.parse(savedAircraft));
      }

      // 飛行記録を読み込み
      const savedRecords = localStorage.getItem('droneFlightRecords');
      if (savedRecords) {
        const records = JSON.parse(savedRecords);
        setFlightRecords(records);
        setRecentRecords(records.slice(0, 5)); // 最新5件
      }
    } catch (error) {
      console.error('データの読み込みに失敗しました:', error);
    }
  };

  const calculateStats = () => {
    if (flightRecords.length === 0) {
      return {
        totalFlights: 0,
        totalFlightTime: 0,
        averageFlightTime: 0,
        thisMonthFlights: 0
      };
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const thisMonthFlights = flightRecords.filter(record => 
      record.flightDate.startsWith(currentMonth)
    ).length;

    const totalFlightTime = flightRecords.reduce((total, record) => 
      total + record.flightDuration, 0
    );

    return {
      totalFlights: flightRecords.length,
      totalFlightTime,
      averageFlightTime: Math.round(totalFlightTime / flightRecords.length),
      thisMonthFlights
    };
  };

  const stats = calculateStats();

  return (
    <div className="page-content">
      <section className="dashboard-header">
        <h2>ダッシュボード</h2>
        <p className="section-description">
          ドローン飛行記録システムの概要と最新の活動状況をご確認いただけます。
        </p>
      </section>

      {/* 統計情報 */}
      <section className="stats-section">
        <h3>飛行統計</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalFlights}</div>
            <div className="stat-label">総飛行回数</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalFlightTime}</div>
            <div className="stat-label">総飛行時間（分）</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.averageFlightTime || 0}</div>
            <div className="stat-label">平均飛行時間（分）</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.thisMonthFlights}</div>
            <div className="stat-label">今月の飛行回数</div>
          </div>
        </div>
      </section>

      {/* 登録機体情報 */}
      <section className="aircraft-summary">
        <h3>登録機体情報</h3>
        {aircraftInfo ? (
          <div className="aircraft-card">
            <div className="aircraft-info-grid">
              <div className="info-item">
                <strong>登録記号:</strong> {aircraftInfo.registrationNumber}
              </div>
              <div className="info-item">
                <strong>種類:</strong> {aircraftInfo.aircraftType}
              </div>
              <div className="info-item">
                <strong>型式:</strong> {aircraftInfo.model || '未設定'}
              </div>
              <div className="info-item">
                <strong>製造者:</strong> {aircraftInfo.manufacturer}
              </div>
            </div>
            <Link to="/aircraft" className="edit-link">機体情報を編集</Link>
          </div>
        ) : (
          <div className="no-aircraft-message">
            <p>機体情報が登録されていません</p>
            <Link to="/aircraft" className="primary-btn">機体情報を登録</Link>
          </div>
        )}
      </section>

      {/* 最近の飛行記録 */}
      <section className="recent-flights">
        <h3>最近の飛行記録</h3>
        {recentRecords.length > 0 ? (
          <>
            <div className="recent-flights-list">
              {recentRecords.map(record => (
                <div key={record.id} className="recent-flight-item">
                  <div className="flight-date-time">
                    <strong>{record.flightDate}</strong>
                    <span>{record.takeoffTime} - {record.landingTime}</span>
                  </div>
                  <div className="flight-info">
                    <div>目的: {record.flightPurpose}</div>
                    <div>場所: {record.takeoffLocation}</div>
                    <div>時間: {record.flightDuration}分</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/flight-log" className="view-all-link">すべての飛行記録を表示</Link>
          </>
        ) : (
          <div className="no-flights-message">
            <p>飛行記録がありません</p>
            <Link to="/flight-log" className="primary-btn">初回飛行記録を追加</Link>
          </div>
        )}
      </section>

      {/* クイックアクション */}
      <section className="quick-actions">
        <h3>クイックアクション</h3>
        <div className="action-buttons">
          <Link to="/flight-log" className="action-btn primary">
            <div className="action-icon">📝</div>
            <div className="action-text">
              <strong>飛行記録追加</strong>
              <small>新しい飛行記録を入力</small>
            </div>
          </Link>
          <Link to="/aircraft" className="action-btn secondary">
            <div className="action-icon">🚁</div>
            <div className="action-text">
              <strong>機体情報管理</strong>
              <small>機体の基本情報を確認・編集</small>
            </div>
          </Link>
        </div>
      </section>

      {/* お知らせ・ヘルプ */}
      <section className="help-section">
        <h3>ご利用にあたって</h3>
        <div className="help-content">
          <div className="help-item">
            <h4>📋 飛行日誌について</h4>
            <p>
              このシステムは航空法に基づく無人航空機の飛行日誌の記録要件に準拠しています。
              特定飛行を行う場合は、必ず事前に機体情報を登録し、飛行毎に記録を作成してください。
            </p>
          </div>
          <div className="help-item">
            <h4>💾 データの保存</h4>
            <p>
              入力したデータはブラウザのローカルストレージに保存されます。
              重要なデータは定期的にCSV出力機能を使ってバックアップを取ることをお勧めします。
            </p>
          </div>
          <div className="help-item">
            <h4>📊 CSV出力</h4>
            <p>
              飛行記録一覧画面から、すべての記録をCSV形式でエクスポートできます。
              官公庁への提出資料作成や長期保存にご活用ください。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;