import React, { useState } from 'react';
import { ResponsiveFunnel } from '@nivo/funnel';
import "./reports.css";
// Yordamchi komponent: Sana inputini ikonka bilan o'rab chiqadi va ikkalasi ham bosilganda kalendarni ochadi
const DateInputWithIcon = ({ date, setDate }) => {
    // Brauzer kalendarini ochish uchun input elementiga murojaat
    const dateInputRef = React.useRef(null); 

    const openDatePicker = () => {
        // Input elementi mavjud bo'lsa va showPicker usuli bo'lsa, kalendarni ochish
        // showPicker() usuli barcha brauzerlarda to'liq qo'llab-quvvatlanmagan bo'lishi mumkin.
        if (dateInputRef.current && typeof dateInputRef.current.showPicker === 'function') {
            dateInputRef.current.showPicker();
        } else if (dateInputRef.current) {
            // Agar showPicker() mavjud bo'lmasa, inputni fokuslash kalendar ochilishiga yordam berishi mumkin (ba'zi brauzerlarda)
            dateInputRef.current.focus();
        }
    };

    return (
        <div className="cr-date-filter" style={{ position: 'relative' }}>
            {/* 1. Asosiy Input: type="date" bo'lgani uchun brauzer kalendarini chiqaradi */}
            <input 
                ref={dateInputRef}
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                onClick={openDatePicker} // ✨ Inputning o'zini bosganda ham kalendarni ochish
                className="cr-filter-control py-1 pe-5 px-2" 
                style={{ 
                    // Standart ikonkani yashirish/o'zgartirish usuli (brauzerga bog'liq)
                    appearance: 'none', 
                    WebkitAppearance: 'none', 
                    paddingRight: '25px', 
                    cursor: 'pointer' 
                }}
            />
            {/* 2. Custom Ikonka: O'ng tomonda joylashadi */}
            <i 
                className="fa-regular fa-calendar-days" 
                onClick={openDatePicker} // ✨ Ikonkani bosganda kalendarni ochish
                style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    cursor: 'pointer', 
                    color: '#777',
                    zIndex: 1 
                }}
            ></i>
        </div>
    );
}

// ... (Boshqa konstantalar va MyFunnel komponentlari o'zgarmadi)

const funnelStats = [
  { id: 'sorov', label: 'Soʻrovlar', value: 5 },
  { id: 'kutish', label: 'Kutish', value: 3 },
  { id: 'toplam', label: 'Toʻplam', value: 2 },
  { id: 'davomat', label: 'Davomat', value: 1 },
  { id: 'toxtagan', label: 'Toʻlangan', value: 2 },
];

const paidUsersData = [
  {
    fio: 'Faxriddin',
    date: '17.10.2025 - 16:39',
    phone: '911234456',
    status: 'Toʻlangan',
    employee: 'Hojimurod Nasriddinov',
  },
  {
    fio: 'Kamoldin',
    date: '17.10.2025 - 16:01',
    phone: '+998908256308',
    status: 'Toʻlangan',
    employee: 'Hojimurod Nasriddinov',
  },
];

const MyFunnel = ({ data }) => (
  <ResponsiveFunnel
    data={data}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    valueFormat=">-.4s"
    colors={{ scheme: 'spectral' }}
    borderWidth={20}
    labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
    shapeBlending={0.4}
    spacing={2}
  />
);

const conversionStages = [
  { id: 'sorov', label: 'Soʻrovlar' },
  { id: 'kutish', label: 'Kutish' },
  { id: 'toplam', label: 'Toʻplam' },
  { id: 'davomat', label: 'Davomat' },
  { id: 'toxtagan', label: 'Toʻlangan' },
];

const clientSources = [
  { id: 'umumiy', label: 'Umumiy' },
  { id: 'instagram', label: 'Instagramdan' },
  { id: 'telegram', label: 'Telegram' },
];

const overallOptions = [
  { id: 'umumiyd', label: 'Umumiy' },
  { id: 'kochirilgan', label: 'Koʻchirilgan' },
  { id: 'ushbu', label: 'Ushbu boʻlimdagi' },
];


const Konversiya = () => {
  // Sanalar YYYY-MM-DD formatida saqlanadi
  const [startDate, setStartDate] = useState('2025-10-01'); 
  const [endDate, setEndDate] = useState('2025-10-17');

 
const [activeStage, setActiveStage] = useState('toxtagan');
  const [isClientSourceOpen, setIsClientSourceOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState('Mijoz manbalari');

  const [isOverallOpen, setIsOverallOpen] = useState(false);
  const [selectedOverall, setSelectedOverall] = useState('Umumiy');

  const handleStageClick = (stageId) => {
    setActiveStage(stageId);
  };

  const toggleClientSourceDropdown = () => {
    setIsClientSourceOpen(!isClientSourceOpen);
    setIsOverallOpen(false);
  };

  const handleSourceSelect = (sourceLabel) => {
    setSelectedSource(sourceLabel);
    setIsClientSourceOpen(false);
  };

  const toggleOverallDropdown = () => {
    setIsOverallOpen(!isOverallOpen);
    setIsClientSourceOpen(false);
  };

  const handleOverallSelect = (overallLabel) => {
    setSelectedOverall(overallLabel);
    setIsOverallOpen(false);
  };

  const isPaidStageActive = activeStage === 'toxtagan';

  const getButtonClassName = (stageId) => {
    return activeStage === stageId ? 'cr-stat-button cr-active' : 'cr-stat-button';
  };

  return (
    <div className="cr-page-container">
      <header className="cr-header">
        <div className="py-2 cr-notification d-flex justify-content-between">
          <p className="ps-3">
            <i className="fa-regular fa-calendar"></i> Litefsianiyaning
            platformaga amal qilish muddati:
            <span className="text-danger">
              {" "}
              17.10.2025 - 23:59 1 kundan kam vaqt qoldi
            </span>
          </p>
          <button className="cr-exit-button rounded-5 me-3">To'lash</button>
        </div>
      </header>

      <h1 className="cr-title">Konversiya hisobotlari</h1>

      <div className="cr-filters">
        {/* Sana inputi 1: Yangi komponent ishlatilmoqda */}
        <DateInputWithIcon date={startDate} setDate={setStartDate} />

        {/* Sana inputi 2: Yangi komponent ishlatilmoqda */}
        <DateInputWithIcon date={endDate} setDate={setEndDate} />

        {/* Client source dropdown toggle */}
        <div className="cr-dropdown-container">
          <div
            className="cr-select cr-dropdown-toggle cr-filter-control pb-1 fs-6 pe-5 ps-2 input-joyi"
            onClick={toggleClientSourceDropdown}
          >
            {selectedSource}
          </div>

          {isClientSourceOpen && (
            <div className="cr-dropdown-menu">
              {clientSources.map((source) => (
                <div
                  key={source.id}
                  className="cr-dropdown-item"
                  onClick={() => handleSourceSelect(source.label)}
                >
                  {source.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Xodimlar select elementi */}
        <select className="cr-select cr-filter-control py-1 fs-6 pe-5 ps-2 input-joyi">
          <option>Xodimlar tomonidan</option>
        </select>

        {/* Overall filter dropdown toggle */}
        <div className="cr-dropdown-container">
          <div
            className="cr-select cr-dropdown-toggle cr-filter-control pb-1 fs-6 pe-5 input-joyi  ps-2  "
            onClick={toggleOverallDropdown}
          >
            {selectedOverall}
          </div>

          {isOverallOpen && (
            <div className="cr-dropdown-menu ">
              {overallOptions.map((option) => (
                <div
                  key={option.id}
                  className={`cr-dropdown-item ${
                    option.label === selectedOverall
                      ? "cr-dropdown-item-active"
                      : ""
                  }`}
                  onClick={() => handleOverallSelect(option.label)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sozlamalar tugmasi (bu kichikroq bo'lishi mumkin) */}
        <div className="cr-date-filter bg-white py-1 px-1 rounded-1 border px-2">
          ⚙️
        </div>
      </div>

      <div className="cr-content-layout">
        <section>
          <div className="cr-conversion-stats">
            <h2 className="px-4 pt-3">Konversiya</h2>
            <div className="cr-stat-divider"></div>

            <div className="cr-stat-grid">
              <div className="cr-stat-row cr-buttons-row">
                <div className="cr-stat-item cr-empty-cell"></div>

                {conversionStages.map((stage) => (
                  <div className="cr-stat-item" key={stage.id}>
                    <div
                      className={getButtonClassName(stage.id)}
                      onClick={() => handleStageClick(stage.id)}
                    >
                      {stage.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cr-stat-divider"></div>

              <div className="cr-stat-row cr-counts-row">
                <div className="cr-stat-item cr-total-label px-4">Jami</div>

                {funnelStats.map((stat) => (
                  <div
                    className="cr-stat-item cr-count-cell pe-5 me-4"
                    key={stat.id}
                  >
                    {stat.value}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cr-conversion-stats mt-3 px-4 pt-4">
            <div className="cr-table-placeholder">
          

              {isPaidStageActive ? (
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>FIO</th>
                      <th>Telefon</th>
                      <th>Holati</th>
                      <th>Xodim ismi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidUsersData.map((user, index) => (
                      <tr key={index}>
                        <td>
                          <p className="text-primary fw-bold mb-0">
                            {user.fio}
                          </p>
                          <small className="text-muted">{user.date}</small>
                        </td>
                        <td>{user.phone}</td>
                        <td>
                          <span className="badge bg-success">
                            {user.status}
                          </span>
                        </td>
                        <td>{user.employee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">
                    Hisobotni ko‘rish uchun yuqoridagi voronka bosqichlaridan
                    birini tanlang.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grafik-oq-fon pe-5 me-5">
          <h2 className="px-4 pt-3 fs-5 fw-medium">Sotuv voronkasi</h2>
          <div className="cr-funnel-visual pb-5 px-4">
            <MyFunnel data={funnelStats} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Konversiya;