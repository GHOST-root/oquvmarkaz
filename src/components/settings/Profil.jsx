import React, { useState } from 'react';
import { FaRegClock, FaRegFlag, FaRegImage } from 'react-icons/fa';
import { LuMail } from 'react-icons/lu';

const Profil = () => {
	const [activeTab, setActiveTab] = useState('guruhlar');

	return (
		<div>
			<div className='min-vh-100 bg-light p-4'>
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
				<div className='mb-2 mt-4'>
					<h4 className='alert alert-danger fw-normal border-0 d-flex  align-items-center rounded-3'>
						Bu profil arxivlangan. Siz uni arxivda tiklashingiz mumkin
					</h4>
				</div>

				<div className='row g-4'>
					<div className='col-lg-4'>
						<div className='card border-0 shadow-sm rounded-3'>
							<div className='card-body p-4'>
								<div className='mb-1 d-flex justify-content-between'>
									<div
										className='rounded-circle d-flex align-items-center justify-content-center'
										style={{
											width: '120px',
											height: '120px',
											background: '#BDBEC0',
										}}
									>
										<FaRegImage color='white' size={50} />
									</div>
									<div className='d-flex flex-column gap-3'>
										<button
											style={{
												border: '1px solid orange',
												color: 'orange',
												borderRadius: '50%',
												width: '35px',
												height: '35px',
												background: 'transparent',
											}}
											className='d-flex align-items-center justify-content-center'
										>
											<LuMail size={16} />
										</button>
										<button
											style={{
												border: '1px solid orange',
												color: 'orange',
												borderRadius: '50%',
												width: '35px',
												height: '35px',
												background: 'transparent',
											}}
											className='d-flex align-items-center justify-content-center'
										>
											<FaRegClock size={16} />
										</button>
									</div>
								</div>

								<h4 className='mb-1'>Jumaqozi</h4>
								<p className='text-muted small mb-3'>(id: 1488087)</p>

								<div className=' mb-4'>
									<span
										className='badge text-white px-3 py-2 rounded-pill'
										style={{ backgroundColor: '#dc3545', fontSize: '0.95rem' }}
									>
										-250 000 UZS
									</span>
									<span className='text-muted ms-2 small'>balans</span>
								</div>

								<div className='mb-3'>
									<div className='text-muted small'>Telefon:</div>
									<div className='fw-semibold'>91 123 43 31</div>
								</div>

								<div className='mb-3 d-flex align-items-center gap-2'>
									<div className='text-muted small'>Tug'ilgan kun:</div>
									<div className='fw-semibold'>06.10.1994</div>
								</div>
								<hr />

								<div className='mb-3 d-flex align-items-center gap-2'>
									<div className='text-muted small'>
										Talaba qo'shilgan sana:
									</div>
									<div className='fw-semibold'>17 oktabr 2025</div>
								</div>
							</div>
						</div>
						<div
							className='position-relative d-flex align-items-start mt-4 p-3 bg-white card'
							style={{ borderRadius: '10px' }}
						>
							{/* Chapdagi ko‘k chiziq */}
							<div
								style={{
									width: '5px',
									height: '100%',
									backgroundColor: '#009FE3',
									borderRadius: '5px',
									position: 'absolute',
									left: 0,
									top: 0,
								}}
							/>

							{/* Kontent (text + icon) */}
							<div className='d-flex justify-content-between align-items-start w-100 ps-3'>
								<span className='text-muted'>Eslatma</span>
								<button
									style={{
										border: '1px solid #DC3545',
										color: '#DC3545',
										borderRadius: '50%',
										width: '35px',
										height: '35px',
										background: 'transparent',
									}}
									className='d-flex align-items-center justify-content-center'
								>
									<FaRegFlag size={15} />
								</button>
							</div>
						</div>
					</div>

					{/* Right Column - Content */}
					<div className='col-lg-8'>
						<div className='card border-0 shadow-sm rounded-3'>
							<div className='card-body p-4'>
								{/* Tabs */}
								<ul className='nav nav-tabs border-bottom mb-4'>
									<li className='nav-item'>
										<button
											className={`nav-link border-0 ${
												activeTab === 'guruhlar' ? 'active' : ''
											}`}
											onClick={() => setActiveTab('guruhlar')}
											style={{
												color: activeTab === 'guruhlar' ? '#ff9800' : '#6c757d',
												borderBottom:
													activeTab === 'guruhlar'
														? '3px solid #ff9800'
														: '3px solid transparent',
												backgroundColor: 'transparent',
											}}
										>
											Guruhlar
										</button>
									</li>
									<li className='nav-item'>
										<button
											className={`nav-link border-0 ${
												activeTab === 'izohlar' ? 'active' : ''
											}`}
											onClick={() => setActiveTab('izohlar')}
											style={{
												color: activeTab === 'izohlar' ? '#ff9800' : '#6c757d',
												borderBottom:
													activeTab === 'izohlar'
														? '3px solid #ff9800'
														: '3px solid transparent',
												backgroundColor: 'transparent',
											}}
										>
											Izohlar
										</button>
									</li>
									<li className='nav-item'>
										<button
											className={`nav-link border-0 ${
												activeTab === 'qongiroq' ? 'active' : ''
											}`}
											onClick={() => setActiveTab('qongiroq')}
											style={{
												color: activeTab === 'qongiroq' ? '#ff9800' : '#6c757d',
												borderBottom:
													activeTab === 'qongiroq'
														? '3px solid #ff9800'
														: '3px solid transparent',
												backgroundColor: 'transparent',
											}}
										>
											Qo'ng'roq tarixi
										</button>
									</li>
									<li className='nav-item'>
										<button
											className={`nav-link border-0 ${
												activeTab === 'sms' ? 'active' : ''
											}`}
											onClick={() => setActiveTab('sms')}
											style={{
												color: activeTab === 'sms' ? '#ff9800' : '#6c757d',
												borderBottom:
													activeTab === 'sms'
														? '3px solid #ff9800'
														: '3px solid transparent',
												backgroundColor: 'transparent',
											}}
										>
											SMS
										</button>
									</li>
									<li className='nav-item'>
										<button
											className={`nav-link border-0 ${
												activeTab === 'tarix' ? 'active' : ''
											}`}
											onClick={() => setActiveTab('tarix')}
											style={{
												color: activeTab === 'tarix' ? '#ff9800' : '#6c757d',
												borderBottom:
													activeTab === 'tarix'
														? '3px solid #ff9800'
														: '3px solid transparent',
												backgroundColor: 'transparent',
											}}
										>
											Tarix
										</button>
									</li>
									<li className='nav-item'>
										<button
											className={`nav-link border-0 ${
												activeTab === 'lid' ? 'active' : ''
											}`}
											onClick={() => setActiveTab('lid')}
											style={{
												color: activeTab === 'lid' ? '#ff9800' : '#6c757d',
												borderBottom:
													activeTab === 'lid'
														? '3px solid #ff9800'
														: '3px solid transparent',
												backgroundColor: 'transparent',
											}}
										>
											Lid tarixi
										</button>
									</li>
								</ul>

								{/* Warning */}
								<div
									style={{ backgroundColor: '#EAE3D1', paddingLeft: '20px' }}
									className='alert border-0 rounded-3 mb-4 text-warning'
								>
									Talaba faol guruhga qo'shilmagan!
								</div>

								{/* Balance Section */}
								<h5 className='mb-3'>Oylik balans xolati</h5>
								<div className='border border-danger rounded-3 d-inline-block p-3 mb-5'>
									<div className='text-danger small pl-0'>2025 M10 1</div>
									<div
										className='text-danger fw-bold'
										style={{ fontSize: '2rem' }}
									>
										-250,000
									</div>
								</div>

								{/* Payments Section */}
								<h5 className='mb-3'>To'lovlar</h5>
								<div className='table-responsive'>
									<table className='table table-borderless align-start border-0'>
										<thead style={{ backgroundColor: '#f8f9fa' }}>
											<tr>
												<th className='fw-semibold fw-normal py-3'>Sana</th>
												<th className='fw-semibold fw-normal py-3'>Turi</th>
												<th className='fw-semibold fw-normal py-3'>Miqdar</th>
												<th className='fw-semibold fw-normal py-3'>Izoh</th>
												<th className='fw-semibold fw-normal py-3'>Xodim</th>
											</tr>
										</thead>

										<tbody style={{ backgroundColor: '#f5f5f5' }}>
											<tr>
												<td className='py-3'>01.10.2025</td>
												<td>
													<span className='badge bg-secondary px-3 py-2'>
														tizim
													</span>
												</td>
												<td className='text-muted fw-semibold'>-250 000 UZS</td>
												<td>
													<div className='d-flex flex-column'>
														<div className='d-flex gap-2 align-items-center'>
															<span className='fw-semibold small badge bg-secondary'>
																FrontEnd
															</span>
															<span className='small'>7 dars</span>
														</div>
														<span className='text-muted small'>
															17.10.2025—31.10.2025
														</span>
														<button
															style={{
																width: '55%',
																height: '30px',
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																backgroundColor: 'white',
																fontSize: '0.85rem',
															}}
															className='border rounded-5'
														>
															Ko'proq
														</button>
													</div>
												</td>
												<td>
													<div className='d-flex flex-column'>
														<span className='fw-semibold'>
															Hojmurod Nasriddinov
														</span>
														<span className='text-muted small'>
															17.10.2025 16:04:37
														</span>
													</div>
												</td>
												<td>
													<div className='btn-group' role='group'>
														<button
															type='button'
															className='btn btn-sm btn-outline-primary rounded-start-pill px-3'
														>
															chop etish
														</button>
														<div className='btn-group' role='group'>
															<button
																type='button'
																className='btn btn-sm btn-outline-primary dropdown-toggle rounded-end-pill'
																data-bs-toggle='dropdown'
															></button>
															<ul className='dropdown-menu'>
																<li>
																	<a className='dropdown-item' href='#'>
																		Dropdown link
																	</a>
																</li>
																<li>
																	<a className='dropdown-item' href='#'>
																		Dropdown link
																	</a>
																</li>
															</ul>
														</div>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profil;
