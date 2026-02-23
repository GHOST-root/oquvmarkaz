function ExclamationIcon() {
	return (
		<>
			<svg
				fill='#0D81FD'
				height='16px'
				width='16px'
				version='1.1'
				id='Capa_1'
				xmlns='http://www.w3.org/2000/svg'
				xmlnsXlink='http://www.w3.org/1999/xlink'
				viewBox='0 0 27.963 27.963'
				xmlSpace='preserve'
			>
				<g>
					<g id='c129_exclamation'>
						<path
							d='M13.983,0C6.261,0,0.001,6.259,0.001,13.979c0,7.724,6.26,13.984,13.982,13.984s13.98-6.261,13.98-13.984
			C27.963,6.259,21.705,0,13.983,0z M13.983,26.531c-6.933,0-12.55-5.62-12.55-12.553c0-6.93,5.617-12.548,12.55-12.548
			c6.931,0,12.549,5.618,12.549,12.548C26.531,20.911,20.913,26.531,13.983,26.531z'
						/>
						<polygon points='15.579,17.158 16.191,4.579 11.804,4.579 12.414,17.158 		' />
						<path
							d='M13.998,18.546c-1.471,0-2.5,1.029-2.5,2.526c0,1.443,0.999,2.528,2.444,2.528h0.056c1.499,0,2.469-1.085,2.469-2.528
			C16.441,19.575,15.468,18.546,13.998,18.546z'
						/>
					</g>
					<g id='Capa_1_207_'></g>
				</g>
			</svg>
		</>
	);
}

const Holidays = () => {
	return (
		<>
			<div
				className='alert bg-white d-flex justify-content-between align-items-center gap-2 mb-0'
				role='alert'
			>
				<div style={{ fontSize: '14px' }}>
					<span className='fw-semibold'>
						Litsenziyangizning platformaga amal qilish muddati:
					</span>

					<span className='fw-semibold text-danger ms-2'>
						17.10.2025 — 23:59 | 3 kundan kam vaqt qoldi
					</span>
				</div>
				<div>
					<button className='small-btn'>To'lash</button>
				</div>
			</div>
			<h2 className='my-3'>Dam olish kunlari</h2>
		
				<p className='text-primary small mb-3 d-flex align-items-center gap-1'>
					<ExclamationIcon /> Taxrirlash, qo'shish va o'chirish amaliyotlari
					ustida ishlanmoqda. Tez orada barcha tugmalar ishga tushadi.
				</p>
			

			<div
				style={{ width: '65%' }}
				className='groups-page bg-white p-4 rounded shadow-sm position-relative'
			>
				<table
					style={{
						borderTop: '1px solid #F0F0F0',
						borderBottom: '1px solid #F0F0F0',
					}}
					className='table groups-table  align-middle mt-1'
				>
					<thead>
						<tr>
							<th className='fw-bold'>Ism</th>
							<th className='fw-bold'>Bayram sanasi</th>
							<th className='fw-bold'>To'lovga ta'sir qiladi</th>
							<th className='fw-bold'>Yaratilgan</th>
							<th className='fw-bold'>Amallar</th>
						</tr>
					</thead>
				</table>
			</div>
		</>
	);
};

export default Holidays;