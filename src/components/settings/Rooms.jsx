import React, { useState, useEffect } from 'react';

const InputForm = ({ onSubmit, initialData }) => {
	const [formData, setFormData] = useState({
		name: '',
		capacity: '',
	});

	useEffect(() => {
		if (initialData) setFormData(initialData);
	}, [initialData]);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = e => {
		e.preventDefault();
		onSubmit(formData);

		setFormData({
			name: '',
			capacity: '',
		});
	};

	return (
		<form className='mt-3' onSubmit={handleSubmit}>
			{[
				{ label: 'Ism', name: 'name' },
				{ label: "Xona sig'imi", name: 'capacity' },
			].map((field, idx) => (
				<div className='mb-2 position-relative' key={idx}>
					<label className='form-label text-menu text-dark fw-medium'>
						{field.label}
					</label>

					<input
						type='text'
						name={field.name}
						value={formData[field.name]}
						onChange={handleChange}
						className='form-control small-input'
					/>
				</div>
			))}

			<div className='mt-3'>
				<button
					type='submit'
					className='border rounded-5 buttonsaqla py-2 px-3'
				>
					Saqlash
				</button>
			</div>
		</form>
	);
};

const Rooms = () => {
	const [showPanel, setShowPanel] = useState(false);
	const [rooms, setRooms] = useState([]);
	const [panelMode, setPanelMode] = useState('add');
	const [selectedRoom, setSelectedRoom] = useState(null);

	const fetchRooms = async () => {
		try {
			const res = await fetch(
				'https://website98.pythonanywhere.com/api/xonalar/'
			);
			if (!res.ok) throw new Error('Xonalar olinmadi');
			const data = await res.json();
			setRooms(data);
		} catch (error) {
			alert(error.message);
		}
	};

	useEffect(() => {
		fetchRooms();
	}, []);

	const handleAddRoom = async formData => {
		try {
			const res = await fetch(
				'https://website98.pythonanywhere.com/api/xona-qoshish/',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				}
			);

			if (!res.ok) throw new Error('Xona qo‘shishda xatolik');

			const data = await res.json();
			setRooms(prev => [...prev, data]);
			setShowPanel(false);
		} catch (error) {
			alert(error.message);
		}
	};

	const handleUpdateRoom = async formData => {
		try {
			const res = await fetch(
				`https://website98.pythonanywhere.com/api/xona-tahrirlash/${selectedRoom.id}/`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				}
			);

			if (!res.ok) throw new Error('Xonani yangilashda xatolik');

			const data = await res.json();

			setRooms(prev =>
				prev.map(room => (room.id === selectedRoom.id ? data : room))
			);

			setShowPanel(false);
			setSelectedRoom(null);
		} catch (error) {
			alert(error.message);
		}
	};

	const handleDeleteRoom = async () => {
		try {
			const res = await fetch(
				`https://website98.pythonanywhere.com/api/xona-ochirish/${selectedRoom.id}/`,
				{
					method: 'DELETE',
					headers: {},
				}
			);

			if (!res.ok) throw new Error('Xonani o‘chirishda xatolik');

			setRooms(prev => prev.filter(room => room.id !== selectedRoom.id));
			setShowPanel(false);
			setSelectedRoom(null);
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<>
			<div
				className='alert bg-white d-flex justify-content-between align-items-center gap-2 mb-0'
				role='alert'
			>
				<div>
					<span className='fw-semibold fs-6'>
						Litsenziyangizning platformaga amal qilish muddati:
					</span>

					<span>17.10.2025 — 23:59</span>

					<span className='fw-semibold text-danger ms-2'>
						| 3 kundan kam vaqt qoldi
					</span>
				</div>
				<div>
					<button className='small-btn'>To'lash</button>
				</div>
			</div>
			<div className='d-flex justify-content-between align-items-center'>
				<div>
					<h2 className='my-3 text-dark'>Xonalar</h2>
				</div>

				<button
					className='add-btn'
					onClick={() => {
						setPanelMode('add');
						setSelectedRoom(null);
						setShowPanel(true);
					}}
				>
					Yangisini qo‘shish
				</button>
			</div>
			<div className='groups-page bg-white p-4 rounded shadow-sm position-relative'>
				<div className='d-flex justify-content-between align-items-center mb-2'></div>

				<table className='table groups-table align-middle mt-1'>
					<thead>
						<tr>
							<th className='fw-bold'>ID</th>
							<th className='fw-bold'>Ism</th>
							<th className='fw-bold'>Xona sig'imi</th>
							<th className='fw-bold'>Amallar</th>
						</tr>
					</thead>

					<tbody>
						{rooms.map(room => (
							<tr key={room.id}>
								<td>{room.id}</td>
								<td>{room.name}</td>
								<td>{room.capacity}</td>
								<td className='d-flex gap-4'>
									<button
										className='dots-btn'
										onClick={() => {
											setPanelMode('edit');
											setSelectedRoom(room);
											setShowPanel(true);
										}}
									>
										<i
											className='fa-solid fa-pen'
											style={{ color: 'black' }}
										></i>
									</button>
									<button
										className='dots-btn'
										onClick={() => {
											setPanelMode('delete');
											setSelectedRoom(room);
											setShowPanel(true);
										}}
									>
										<i
											className='fa-solid fa-trash'
											style={{ color: 'red' }}
										></i>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{showPanel && (
					<div
						className='side-panel-overlay active'
						onClick={() => setShowPanel(false)}
					></div>
				)}

				<div className={`side-panel ${showPanel ? 'show' : ''}`}>
					<div className='px-4 position-relative h-100'>
						<button
							className='close-btn position-absolute top-0 end-0 me-3 fs-6 fw-bold text-secondary'
							onClick={() => setShowPanel(false)}
						>
							✕
						</button>

						<h5 className='mb-2 mt-4 fw-medium'>
							{panelMode === 'add' && 'Yangi xona qo‘shish'}
							{panelMode === 'edit' && 'Xonani o‘zgartirish'}
							{panelMode === 'delete' && 'Xonani o‘chirish'}
						</h5>
						<div className='div bg-black border w-100 mb-2'></div>

						{(panelMode === 'add' || panelMode === 'edit') && (
							<InputForm
								onSubmit={
									panelMode === 'add' ? handleAddRoom : handleUpdateRoom
								}
								initialData={selectedRoom}
							/>
						)}

						{panelMode === 'delete' && (
							<div className='mt-4'>
								<p>
									<strong>{selectedRoom?.name}</strong> nomli xonani
									o‘chirmoqchimisiz?
								</p>
								<button
									className='border rounded-5 buttonsaqla py-2 px-3'
									onClick={handleDeleteRoom}
								>
									Ha, o‘chir
								</button>
							</div>
						)}
					</div>

					<style>{`
						.side-panel-overlay {
							position: fixed;
							inset: 0;
							background: rgba(0, 0, 0, 0.4);
							opacity: 0;
							visibility: hidden;
							transition: all 0.3s ease;
							z-index: 998;
						}
						.side-panel-overlay.active {
							opacity: 1;
							visibility: visible;
						}
						.side-panel {
							position: fixed;
							top: 0;
							right: 0;
							height: 100%;
							width: 350px;
							background: #fff;
							box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
							transform: translateX(100%);
							transition: transform 0.3s ease;
							z-index: 999;
						}
						.side-panel.show {
							transform: translateX(0);
						}
						.close-btn {
							border: none;
							background: transparent;
							font-size: 1.5rem;
							color: #555;
							cursor: pointer;
						}
						.small-input {
							height: 32px;
							font-size: 0.875rem;
							padding: 0.25rem 0.5rem;
						}
					`}</style>
				</div>
			</div>
		</>
	);
};

export default Rooms;