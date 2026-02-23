import React, { useState, useEffect } from 'react';
import { HiDownload } from 'react-icons/hi';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
	IoPlaySkipBackOutline,
	IoPlaySkipForwardOutline,
} from 'react-icons/io5';

const API_URL = '';

const Arxiv = () => {
	// FILTER STATE-LAR
	const [searchName, setSearchName] = useState('');
	const [role, setRole] = useState('');
	const [sabab, setSabab] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	// DATA STATE
	const [arxiv, setArxiv] = useState([]);
	const [loading, setLoading] = useState(false);

	// API DAN DATA OLISH
	// useEffect(() => {
	// 	setLoading(true);

	// 	fetch(API_URL)
	// 		.then(res => res.json())
	// 		.then(data => {
	// 			setArxiv(
	// 				data.map(item => ({
	// 					id: <input type='checkbox' />,
	// 					name: item.name,
	// 					tel: item.phone,
	// 					role: item.role,
	// 					delete_sabab: item.delete_reason || '',
	// 					izoh: item.comment || '',
	// 					archived: item.archived_at,
	// 				}))
	// 			);
	// 		})
	// 		.catch(err => console.error('API xato:', err))
	// 		.finally(() => setLoading(false));
	// }, []);

	const filters = [
		{ type: 'input', placeholder: 'Ism yoki Telefon' },
		{
			type: 'select',
			placeholder: 'Rollar bo‘yicha filtr',
			options: [
				'CEO',
				'Adminstrator',
				'HR',
				'Cashier',
				'Marketer',
				'Teacher',
				'Student',
			],
		},
		{
			type: 'select',
			placeholder: 'Sabab bo‘yicha filtr',
			options: ["Ma'lumot yo'q"],
		},
		{ type: 'date', placeholder: 'Boshlanish sanasi' },
		{ type: 'date', placeholder: 'Tugash sanasi' },
	];

	// QAYTA TIKLASH
	const handleRestore = () => {
		setSearchName('');
		setRole('');
		setSabab('');
		setStartDate('');
		setEndDate('');
	};

	// FILTRLASH
	const filteredArxiv = arxiv.filter(item => {
		return (
			item.name.toLowerCase().includes(searchName.toLowerCase()) &&
			(role ? item.role === role : true) &&
			(sabab ? item.delete_sabab === sabab : true)
		);
	});

	const handleDelete = () => {
		console.log('Delete bosildi');
		// keyin API delete shu yerga ulanadi
	};

	const handleMail = () => {
		console.log('Mail bosildi');
	};

	const actions = [
		{
			type: 'button',
			label: 'O‘chirish',
			className: 'btn',
			style: {
				color: 'red',
				background: 'white',
				borderRadius: '4px',
				border: '#f0f0f0 1px solid',
			},
			onClick: () => handleDelete(),
		},
		{
			type: 'button',
			label: 'Qayta tiklash',
			className: 'btn',
			style: {
				color: 'green',
				background: 'white',
				borderRadius: '4px',
				border: '#f0f0f0 1px solid',
			},
			onClick: () => handleRestore(),
		},
		{
			type: 'icon',
			className: 'btn btn-outline-warning',
			style: { borderRadius: '100%' },
			icon: 'bi bi-envelope',
			onClick: () => handleMail(),
		},
	];

	return (
		<>
			{/* HEADER */}
			<div className='alert bg-white d-flex justify-content-between align-items-center gap-2 mb-0'>
				<div style={{ fontSize: '14px' }}>
					<span className='fw-semibold'>Litsenziya muddati: </span>
					<span className='fw-semibold text-danger ms-2'>
						17.10.2025 — 23:59 | 3 kun qoldi
					</span>
				</div>
				<button className='small-btn'>To'lash</button>
			</div>

			<div className='d-flex justify-content-between my-4 align-items-center'>
				<h2 className='mb-0 text-dark'>
					Arxiv <span className='count'>Miqdor — {filteredArxiv.length}</span>
				</h2>
				<button
					style={{
						border: 'gray 1px solid',
						borderRadius: '4px',
						padding: '8px 22px',
						color: 'gray',
						background: 'white',
					}}
				>
					Arxivlash sabablari
				</button>
			</div>

			{/* FILTERS */}
			<div className='filters d-flex flex-wrap gap-2 mb-2'>
				{filters.map((item, index) => (
					<div key={index}>
						{item.type === 'input' && (
							<input
								type='text'
								className='form-control'
								placeholder={item.placeholder}
								value={searchName}
								onChange={e => setSearchName(e.target.value)}
							/>
						)}

						{item.type === 'select' &&
							item.placeholder === 'Rollar bo‘yicha filtr' && (
								<select
									className='form-select select-gray'
									value={role}
									onChange={e => setRole(e.target.value)}
								>
									<option value=''>{item.placeholder}</option>
									{item.options.map((o, i) => (
										<option key={i}>{o}</option>
									))}
								</select>
							)}

						{item.type === 'select' &&
							item.placeholder === 'Sabab bo‘yicha filtr' && (
								<select
									className='form-select select-gray'
									value={sabab}
									onChange={e => setSabab(e.target.value)}
								>
									<option value=''>{item.placeholder}</option>
									{item.options.map((o, i) => (
										<option key={i}>{o}</option>
									))}
								</select>
							)}

						{item.type === 'date' &&
							item.placeholder === 'Boshlanish sanasi' && (
								<input
									type='date'
									className='form-control'
									value={startDate}
									onChange={e => setStartDate(e.target.value)}
								/>
							)}

						{item.type === 'date' && item.placeholder === 'Tugash sanasi' && (
							<input
								type='date'
								className='form-control'
								value={endDate}
								onChange={e => setEndDate(e.target.value)}
							/>
						)}
					</div>
				))}

				{actions.map((a, i) => (
					<div key={i}>
						{a.type === 'button' && (
							<button
								className={a.className}
								style={a.style}
								onClick={a.onClick}
							>
								{a.label}
							</button>
						)}

						{a.type === 'icon' && (
							<button
								className={a.className}
								style={a.style}
								onClick={a.onClick}
							>
								<i className={a.icon}></i>
							</button>
						)}
					</div>
				))}
			</div>

			{/* TABLE */}
			<div className='groups-page bg-white p-4 rounded shadow-sm position-relative'>
				<table className='table groups-table align-middle mt-1'>
					<thead>
						<tr>
							<th>
								<input type='checkbox' />
							</th>
							<th>Ism</th>
							<th>Telefon</th>
							<th>Roli</th>
							<th>Sabab</th>
							<th>Izoh</th>
							<th>Arxivlandi</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={7} className='text-center text-secondary'>
									Yuklanmoqda...
								</td>
							</tr>
						) : (
							filteredArxiv.map((g, i) => (
								<tr key={i}>
									<td>{g.id}</td>
									<td>{g.name}</td>
									<td>{g.tel}</td>
									<td>{g.role}</td>
									<td>{g.delete_sabab}</td>
									<td>{g.izoh}</td>
									<td>{g.archived}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* PAGINATION */}
			<div className='d-flex align-items-center justify-content-between mt-3'>
				<div className='d-flex gap-2 align-items-center'>
					<button style={{ color: 'gray' }} className='btn'>
						<IoPlaySkipBackOutline />
					</button>
					<button style={{ color: 'gray' }} className='btn'>
						<IoIosArrowBack />
					</button>
					<button
						style={{
							borderRadius: '50%',
							border: '1px solid #DC3545',
							color: '#DC3545',
							width: '35px',
							height: '35px',
						}}
					>
						1
					</button>
					<button style={{ color: 'gray' }} className='btn'>
						<IoIosArrowForward />
					</button>
					<button style={{ color: 'gray' }} className='btn'>
						<IoPlaySkipForwardOutline />
					</button>
				</div>

				<button className='columns-btn mt-3'>
					<HiDownload size={20} />
				</button>
			</div>

			<style>{`
				td {
					color: gray !important;
				}
				::placeholder {
					color: gray !important;
					opacity: 1;
				}
				.select-gray {
					color: gray;
				}
			`}</style>
		</>
	);
};

export default Arxiv;
