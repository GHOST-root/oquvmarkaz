import { useState } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { LuRefreshCcw } from 'react-icons/lu';

export const LeftStudents = () => {
	const [activeTab, setActiveTab] = useState('new');
	const [startDate, setStartDate] = useState('01.10.2025');
	const [endDate, setEndDate] = useState('17.10.2025');

	// Sample data
	const students = [
		{
			id: 1,
			student: 'Jumaqozi',
			phone: '91 123 43 31',
			course: 'First Course',
			group: 'FrontEnd',
			teacher: 'First teacher',
			status: 'Faol',
			reason: 'Sababsiz',
			note: "Izoh yo'q",
			employee: 'Hojmurod Nasiriddinov',
			timestamp: '18:24 / 17.10.2025',
		},
	];

	return (
		<div className='min-vh-100 bg-light py-4'>
			<div className='container-fluid'>
				{/* Header */}
				<div
					className='alert bg-white d-flex justify-content-between align-items-center gap-2 mb-4'
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

				{/* Title */}
				<div className='d-flex align-items-baseline gap-3 mb-4'>
					<h1 className='h2 fw-semibold'>Guruhni tark etgan o'quvchilar</h1>
					<span className='text-secondary small'>Maqola — 1</span>
				</div>
				<div style={{ height: '100vh' }} className='card mb-4 p-4'>
					<div className='alert alert-success border-0 mb-4' role='alert'>
						<strong>Diqqat!</strong> O'quvning tark etgan talabalar haqidaqida
						mavjud kamtiriliklar topildi. Ushbu tarbiyat natijasi va qizmatda
						kiruvchi malumotlar tarkiblari va Mtodilar arxivlari. 18.02.2025
						sanadan boshlab, oxirlarda misholda yuklamani barobar talabalar
						"Yangi joylari" ga vertilusir, va eski jadvlaga yopilb ko'rsatiluir.
					</div>

					<ul className='nav nav-tabs mb-4'>
						<li className='nav-item'>
							<button
								className={`nav-link ${activeTab === 'new' ? 'active' : ''}`}
								onClick={() => setActiveTab('new')}
							>
								Yangi
							</button>
						</li>
						<li className='nav-item'>
							<button
								className={`nav-link ${activeTab === 'old' ? 'active' : ''}`}
								onClick={() => setActiveTab('old')}
							>
								Eski
							</button>
						</li>
					</ul>
					{activeTab === 'new' && (
						<div>
							<div className='card-body'>
								<div className='row g-3 mb-0'>
									{/* Date Range */}
									<div className='col-lg-2 col-md-3'>
										<div className='input-group'>
											<span className='input-group-text bg-transparent border border-end-0'>
												<FaRegCalendarAlt color='gray' />
											</span>
											<input
												type='text'
												className='form-control'
												value={startDate}
												onChange={e => setStartDate(e.target.value)}
												placeholder='01.10.2025'
											/>
										</div>
									</div>

									<div className='col-lg-2 col-md-3'>
										<div className='input-group'>
											<span className='input-group-text bg-transparent border border-end-0'>
												<FaRegCalendarAlt color='gray' />
											</span>
											<input
												type='text'
												className='form-control'
												value={endDate}
												onChange={e => setEndDate(e.target.value)}
												placeholder='17.10.2025'
											/>
										</div>
									</div>

									{/* Search */}
									<div className='col-lg-2 col-md-3'>
										<input
											type='text'
											className='form-control'
											placeholder='Ism yoki telefon orqali qidirish'
										/>
									</div>

									{/* Course Dropdown */}
									<div className='col-lg-2 col-md-3'>
										<select className='form-select'>
											<option value=''>Kurs</option>
											<option value='first'>First Course</option>
											<option value='second'>Second Course</option>
										</select>
									</div>

									{/* Group Dropdown */}
									<div className='col-lg-2 col-md-3'>
										<select className='form-select'>
											<option value=''>Guruh</option>
											<option value='frontend'>FrontEnd</option>
											<option value='backend'>BackEnd</option>
										</select>
									</div>

									<div className='col-lg-2 col-md-3'>
										<select className='form-select'>
											<option value=''>O'qituvchi</option>
											<option value='frontend'>FrontEnd</option>
											<option value='backend'>BackEnd</option>
										</select>
									</div>

									<div className='row g-3'>
										<div className='col-lg-2 col-md-3'>
											<select className='form-select'>
												<option value=''>Xodim</option>
												<option value='employee1'>Xodim 1</option>
												<option value='employee2'>Xodim 2</option>
											</select>
										</div>

										<div className='col-lg-2 col-md-3'>
											<select className='form-select'>
												<option value=''>Arxivlash sabablari</option>
												<option value='reason1'>Sabab 1</option>
												<option value='reason2'>Sabab 2</option>
											</select>
										</div>
										<div className='col-lg-2 col-md-3'>
											<select className='form-select'>
												<option value=''>Holati</option>
												<option value='active'>Sinov darsida</option>
												<option value='inactive'>Muzlatilgan</option>
												<option value='active'>Faol</option>
											</select>
										</div>
										<div className='col-lg-2 col-md-3'>
											<div className='d-flex gap-2'>
												<button className='btn btn-primary'>Filtr</button>
												<button className='btn btn-outline-secondary d-flex align-items-center btn-lg'>
													<LuRefreshCcw />
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
					{activeTab === 'old' && (
						<div>
							<div className='card-body'>
								<div className='row g-3 mb-0'>
									{/* Date Range */}
									<div className='col-lg-2 col-md-3'>
										<div className='input-group'>
											<span className='input-group-text bg-transparent border border-end-0'>
												<FaRegCalendarAlt color='gray' />
											</span>
											<input
												type='text'
												className='form-control'
												value={startDate}
												onChange={e => setStartDate(e.target.value)}
												placeholder='01.10.2025'
											/>
										</div>
									</div>

									<div className='col-lg-2 col-md-3'>
										<div className='input-group'>
											<span className='input-group-text bg-transparent border border-end-0'>
												<FaRegCalendarAlt color='gray' />
											</span>
											<input
												type='text'
												className='form-control'
												value={endDate}
												onChange={e => setEndDate(e.target.value)}
												placeholder='17.10.2025'
											/>
										</div>
									</div>

									{/* Search */}
									<div className='col-lg-2 col-md-3'>
										<input
											type='text'
											className='form-control'
											placeholder='Ism yoki telefon orqali qidirish'
										/>
									</div>

									{/* Course Dropdown */}
									<div className='col-lg-2 col-md-3'>
										<select className='form-select'>
											<option value=''>Kurs</option>
											<option value='first'>First Course</option>
											<option value='second'>Second Course</option>
										</select>
									</div>

									{/* Group Dropdown */}
									<div className='col-lg-2 col-md-3'>
										<select className='form-select'>
											<option value=''>Guruh</option>
											<option value='frontend'>FrontEnd</option>
											<option value='backend'>BackEnd</option>
										</select>
									</div>

									<div className='col-lg-2 col-md-3'>
										<select className='form-select'>
											<option value=''>O'qituvchi</option>
											<option value='frontend'>FrontEnd</option>
											<option value='backend'>BackEnd</option>
										</select>
									</div>

									<div className='row g-3'>
										<div className='col-lg-2 col-md-3'>
											<select className='form-select'>
												<option value=''>Xodim</option>
												<option value='employee1'>Xodim 1</option>
												<option value='employee2'>Xodim 2</option>
											</select>
										</div>

										<div className='col-lg-2 col-md-3'>
											<select className='form-select'>
												<option value=''>Arxivlash sabablari</option>
												<option value='reason1'>Sabab 1</option>
												<option value='reason2'>Sabab 2</option>
											</select>
										</div>
										<div className='col-lg-2 col-md-3'>
											<select className='form-select'>
												<option value=''>Holati</option>
												<option value='active'>Sinov darsida</option>
												<option value='inactive'>Muzlatilgan</option>
												<option value='active'>Faol</option>
											</select>
										</div>
										<div className='col-lg-6 col-md-6'>
											<div className='d-flex gap-5'>
												<div class='form-check'>
													<input
														class='form-check-input'
														type='checkbox'
														value=''
														id='checkDefault'
													/>
													<label class='form-check-label' for='checkDefault'>
														Arxiv
													</label>
												</div>
												<div class='form-check'>
													<input
														class='form-check-input'
														type='checkbox'
														value=''
														id='checkDefault'
													/>
													<label class='form-check-label' for='checkChecked'>
														Faqat Arxivlanganlar
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					<div className='d-flex justify-content-end gap-2 mb-3'>
						<button className='btn btn-outline-secondary btn-sm'>
							<i className='bi bi-file-text me-2'></i>
							Filtrlar
						</button>
						<button className='btn btn-outline-secondary btn-sm'>
							Ustunlar
						</button>
					</div>

					<div className='card border'>
						<div className='table-responsive'>
							<table
								className='table table-bordered mb-0'
								style={{ fontSize: '0.95rem' }}
							>
								<thead style={{ backgroundColor: '#f8f9fa' }}>
									<tr>
										<th style={{ width: '50px', padding: '12px 8px' }}></th>
										<th style={{ padding: '12px 8px' }}>Talaba</th>
										<th style={{ padding: '12px 8px' }}>Telefon</th>
										<th style={{ padding: '12px 8px' }}>Kurs</th>
										<th style={{ padding: '12px 8px' }}>Guruh</th>
										<th style={{ padding: '12px 8px' }}>O'qituvchi</th>
										<th style={{ padding: '12px 8px' }}>Holati</th>
										<th style={{ padding: '12px 8px' }}>
											Ochirib tashlash sabablari
										</th>
										<th style={{ padding: '12px 8px' }}>Izoh</th>
										<th style={{ padding: '12px 8px' }}>Xodim</th>
									</tr>
								</thead>
								<tbody>
									{students.map(student => (
										<tr key={student.id}>
											<td className='fw-medium' style={{ padding: '12px 8px' }}>
												{student.id}
											</td>
											<td style={{ padding: '12px 8px' }}>
												<a
													href='#'
													className='text-primary text-decoration-none'
												>
													{student.student}
												</a>
											</td>
											<td style={{ padding: '12px 8px' }}>{student.phone}</td>
											<td style={{ padding: '12px 8px' }}>
												<a
													href='#'
													className='text-primary text-decoration-none'
												>
													{student.course}
												</a>
											</td>
											<td style={{ padding: '12px 8px' }}>
												<a
													href='#'
													className='text-primary text-decoration-none'
												>
													{student.group}
												</a>
											</td>
											<td style={{ padding: '12px 8px' }}>
												<a
													href='#'
													className='text-primary text-decoration-none'
												>
													{student.teacher}
												</a>
											</td>
											<td style={{ padding: '12px 8px' }}>{student.status}</td>
											<td style={{ padding: '12px 8px' }}>{student.reason}</td>
											<td style={{ padding: '12px 8px' }}>{student.note}</td>
											<td style={{ padding: '12px 8px' }}>
												<div style={{ fontSize: '0.9rem' }}>
													<a
														href='#'
														className='text-primary text-decoration-none'
													>
														{student.employee}
													</a>
													<div
														className='text-muted'
														style={{ fontSize: '0.8rem', marginTop: '2px' }}
													>
														{student.timestamp}
													</div>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<style >{`
				input::placeholder {
					color: #6c757d !important;
					opacity: 1;
				}

				select {
					color: #6c757d !important;
				}

				.input-group input::placeholder {
					color: #6c757d !important;
				}
			`}</style>
		</div>
	);
};
