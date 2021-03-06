import {useState, useContext} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'
import Logo from '../../public/trackeling.png'
import { VscListFlat } from "react-icons/vsc";
import { BiChevronDown, BiX } from "react-icons/bi";
import {API_URL} from '../../config/url'
import {toast} from 'react-toastify'
import {UserContext} from '../../store/userContext'

function Navbar() {
	const [activeMobile, setActiveMobile] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(false);
	const {isUser, setIsUser, removeCookie} = useContext(UserContext)
	const router = useRouter();
	// const dispatch = useDispatch();
	// const { clearUser } = bindActionCreators(actionCreators, dispatch);
	// const { user } = useSelector((state) => {
	// 	return state;
	// });

	const toggleMobileNav = () => {
		setActiveMobile(!activeMobile);
	};

	const toggleDropdownMenu = () => {
		setActiveDropdown(!activeDropdown);
	};

	const mobileNav = () => {
		if (activeMobile === false) {
			return (
				<i className={styles.mobile_nav_toggle}>
					<VscListFlat onClick={toggleMobileNav} />
				</i>
			);
		} else {
			return (
				<i className={styles.mobile_nav_toggle}>
					<BiX onClick={toggleMobileNav} />
				</i>
			);
		}
	};

	const handleLogout = () => {
		// clearUser();
		removeCookie('authKey')
		localStorage.removeItem("authKey");
		setIsUser(null)
		setTimeout(() => {
			toast.success("You are logged out, see ya!!");
		}, 100)	
		router.push("/login");
	};

	return (
		<header id={styles.header} className="d-flex align-items-center ">
			<div className="container-fluid container-xxl d-flex align-items-center">
				<div id={styles.logo} className="me-auto">
					<Image src={Logo} alt="Trackeling" width="200px" height="73px" />
				</div>

				<nav
					id={styles.navbar}
					className={
						activeMobile
							? `${styles.navbar} order-last order-lg-0 ${styles.navbar_mobile}`
							: `${styles.navbar} order-last order-lg-0`
					}
				>
					<ul>
						<li>
							<Link className="nav-link" href="/">
								HOME
							</Link>
						</li>
						<li>
							<Link className="nav-link" href="/trips">
								TRIPS
							</Link>
						</li>
								{isUser && <li className='nav-link'>
									<Link className="nav-link" href="/trip/create">
										CREATE TRIP
									</Link>
								</li>}

								{isUser && <li className={styles.dropdown}>
									<div className={`d-flex ${styles.account}`}>
										<div className={styles.avatar}>
											<Image src={`${API_URL}${isUser.avatar}`} width="40px" height="40px"/>						
										</div>
										<a href="#">
											{isUser.username.toUpperCase()}
											<i>
												<BiChevronDown size={25} onClick={toggleDropdownMenu} />
											</i>
										</a>
									</div>

									<ul className={activeDropdown ? styles.dropdown_active : ""}>
										<li>
											<Link href="/user/account">SETTING ACCOUNT</Link>
										</li>
										<li>
											<Link href="/user/mytrip">MY TRIP</Link>
										</li>
									</ul>
								</li>}						
							{!isUser && <li> <Link className="nav-link" href="/signup"> REGISTER </Link> </li>}						
					</ul>
					{mobileNav()}
				</nav>
					{isUser && <button onClick={handleLogout} className={styles.logout}> LOGOUT </button>}			
					{!isUser && <div className={styles.login}><Link className={styles.login} href="/login"> LOGIN</Link> </div>}
				
			</div>
		</header>
	);
}

export default Navbar;