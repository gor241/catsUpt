const main = document.querySelector(".cats__cards");
const popupLinks = document.querySelectorAll('.popup-link')
const body = document.querySelector('body')
const lockPadding = document.querySelectorAll('.lock-padding')

let unlock = true
const timeout = 800

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '')
			const curentPopup = document.getElementById(popupName)
			console.log(popupName);
			popupOpen(curentPopup)
			e.preventDefault()
		})
	}
}
const popupCloseIcon = document.querySelectorAll('.close-popup')
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'))
			e.preventDefault()
		})
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open')
		const cardPopup = document.querySelector('.card-popup.open')
		const catsPopup = document.querySelector('.cats-popup.open')
		const loginPopup = document.querySelector('.login-popup.open')
		const changePopup = document.querySelector('.popup-change.open')
		if (popupActive) {
			popupClose(popupActive, false)
		} else if (cardPopup) {
			popupClose(cardPopup, false)
		}
		else if (catsPopup) {
			popupClose(catsPopup, false)
		}
		else if (changePopup) {
			popupClose(changePopup, false)
		} else if (loginPopup) {
			popupClose(loginPopup, false)
		} else {
			bodyLock()
		}
		curentPopup.classList.add('open')
		curentPopup.addEventListener('click', function (e) {
			el = e.target
			if (!el.closest('.popup__content') && !el.closest(".card-popup__content") && !el.closest(".cats-popup__content") && !el.closest(".login-popup__content") && !el.closest(".popup-change__content")) {
				if (el.closest('.popup')) {
					popupClose(el.closest('.popup'))
				} else if (el.closest('.card-popup')) {
					popupClose(el.closest('.card-popup'))
				} else if (el.closest('.login-popup')) {
					popupClose(el.closest('.login-popup'))
				} else if (el.closest('.cats-popup')) {
					popupClose(el.closest('.cats-popup'))
				} else (
					popupClose(el.closest('.popup-change'))
				)
			}
		})
	}
}
function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open')
		if (doUnlock) {
			bodyUnlock()
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + "px"
	if (lockPadding.length > 0) {
		for (let i = 0; i < lockPadding.length; i++) {
			const el = lockPadding[i]
			el.style.paddingRight = lockPaddingValue
		}
	}
	body.style.paddingRight = lockPaddingValue
	body.classList.add('lock')

	unlock = false
	setTimeout(function () {
		unlock = true
	}, timeout)
}
function bodyUnlock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = "0px"
			}
		}
		body.style.paddingRight = '0px'
		body.classList.remove('lock')
	}, timeout)
	unlock = false
	setTimeout(function () {
		unlock = true
	}, timeout)
}
document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open')
		const popupCard = document.querySelector('.card-popup.open')
		const popupCats = document.querySelector('.cats-popup.open')
		const loginCats = document.querySelector('.login-popup.open')
		const changePopup = document.querySelector('.popup-change.open')
		if (popupActive) {
			popupClose(popupActive)
		} else if (popupCard) {
			popupClose(popupCard)
		} else if (loginCats) {
			popupClose(loginCats)
		} else if (changePopup) {
			popupClose(changePopup)
		} else {
			popupClose(popupCats)
		}
	}
})



const checkbox = document.querySelector(".popup__pet");
const checkboxParent = document.querySelector('.popup__checkbox')

checkboxParent.addEventListener('click', function () {
	if (checkbox.checked == false) {
		checkboxParent.classList.add('active')
		checkbox.checked = true
	} else {
		checkboxParent.classList.remove('active')
		checkbox.checked = false
	}
});




const api = new Api("Ruslan_Nuriev"); // мое уникальное имя!! Использовать свое!
let form = document.forms[0];
const imgLin = document.querySelector(".popup__image")
form.img_link.addEventListener("change", (e) => {
	imgLin.style.backgroundImage = `url(${e.target.value})`
})
form.img_link.addEventListener("input", (e) => {
	imgLin.style.backgroundImage = `url(${e.target.value})`
})
form.addEventListener("submit", (e) => {
	e.preventDefault();
	let body = {};
	for (let i = 0; i < form.elements.length; i++) {
		let inp = form.elements[i];
		if (inp.type === "checkbox") {
			body[inp.name] = inp.checked;
		} else if (inp.name && inp.value) {
			if (inp.type === "number") {
				body[inp.name] = +inp.value;
			} else {
				body[inp.name] = inp.value;
			}
		}
	}
	console.log(body);
	api.addCat(body)
		.then(res => res.json())
		.then(data => {
			if (data.message === "ok") {
				form.reset();
				const popup = document.querySelector('.popup')
				popupClose(popup);
				api.getCat(body.id)
					.then(res => res.json())
					.then(cat => {
						if (cat.message === "ok") {
							catsData.push(cat.data);
							localStorage.setItem("cats", JSON.stringify(catsData));
							getCats(api, catsData);
						} else {
							console.log(cat);
						}
					})
			} else {
				console.log(data);
				api.getIds().then(r => r.json()).then(d => console.log(d));
			}
		})
})

const updCards = function (data) {
	main.innerHTML = ""
	data.forEach(function (cat) {
		if (cat.id) {
			let card = `<div class="${cat.favourite ? "cats__card like" : "cats__card popup-link"}" style="background-image:
	url(${cat.img_link || "images/cat.jpg"})">
	<span>${cat.name}</span>
	</div>`;
			main.innerHTML += card;
		}
	});
	let cards = document.getElementsByClassName("cats__card");
	for (let i = 0, cnt = cards.length; i < cnt; i++) {
		const width = cards[i].offsetWidth;
		cards[i].style.height = width * 0.6 + "px";
	}
}


const getCats = function (api) {
	api.getCats()
		.then(res => res.json())
		.then(data => {
			if (data.message === "ok") {
				updCards(data.data);
			}
		})
}
getCats(api);


let catsData = localStorage.getItem("cats");
catsData = catsData ? JSON.parse(catsData) : [];
const getsCats = function (api, store) {
	if (!store.length) {
		api.getCats()
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data.message === "ok") {
					localStorage.setItem("cats", JSON.stringify(data.data));
					catsData = [...data.data];
					updCards(data.data);
				}
			})
	} else {
		updCards(store);
	}
}
getsCats(api, catsData);


main.addEventListener('click', function (e) {

	const el = e.target
	if (el.closest('.cats__card')) {
		const curentPopup = document.getElementById('card-popup')
		popupOpen(curentPopup)
		e.preventDefault()
		if (curentPopup.classList.contains('open')) {
			const delCatButton = document.querySelector('.card-popup__button_del')
			delCatButton.addEventListener('click', function (e) {
				catsData.forEach((el) => {
					if (el.img_link === url) {
						api.delCat(el.id)
							.then(res => res.json())
							.then(data => {
								console.log(data.data);
								popupClose(curentPopup)
								if (data.message === "ok") {
									localStorage.clear()
									api.getCats()
										.then(res => res.json())
										.then(data => {
											console.log(data);
											if (data.message === "ok") {
												localStorage.setItem("cats", JSON.stringify(data.data));
												catsData = [...data.data];
											}
										})
								}
							})
					}
				})
				e.preventDefault()
			}, { once: true })
			const changeCatButton = document.querySelector('.card-popup__button_put')
			changeCatButton.addEventListener('click', function (e) {
				catsData.forEach((el) => {
					if (el.img_link === url) {
						const formTwo = document.querySelector('.popup-change__form');
						const imgLink = document.querySelector(".popup-change__image")
						const image = document.querySelector('.popup-change__image')
						const name = document.querySelector('.popup-change__name')
						const age = document.querySelector('.popup-change__age')
						const area = document.querySelector('.popup-change__area')
						const reit = document.querySelector('.popup-change__raiting')
						const like = document.querySelector('.popup-change__pet')
						const likePar = document.querySelector('.popup-change__checkbox')
						const url = document.querySelector('.popup-change__link')
						image.style.backgroundImage = `url(${el.img_link})`
						name.value = el.name
						age.value = el.age
						url.value = el.img_link
						area.value = el.description
						reit.value = el.rate
						if (el.favourite) {
							likePar.classList.add('active')
							like.checked = true
						} else {
							likePar.classList.remove('active')
							like.checked = false
						}
						formTwo.img_link.addEventListener("change", (e) => {
							imgLink.style.backgroundImage = `url(${e.target.value})`
						})
						formTwo.img_link.addEventListener("input", (e) => {
							imgLink.style.backgroundImage = `url(${e.target.value})`
						})
					}
				})
				e.preventDefault()
			}, { once: true })
			const img = document.querySelector('.card-popup__image')
			img.style.backgroundImage = el.style.backgroundImage
			const url = el.style.backgroundImage.replace(/^[url("]+|[")]+$/g, '');
			catsData.forEach((el) => {
				if (el.img_link === url) {
					const name = document.querySelector('.card-popup__name span')
					const age = document.querySelector('.card-popup__age span')
					const description = document.querySelector('.card-popup__description span')
					const rate = document.querySelector('.card-popup__raiting span')
					const like = document.querySelector('.card-popup__like span')
					name.innerHTML = el.name
					age.innerHTML = el.age
					description.innerHTML = el.description
					rate.innerHTML = el.rate
					if (el.favourite) {
						like.innerHTML = 'Да'
					} else {
						like.innerHTML = 'Нет'
					}
				}
			})
		}
	}
})
const cardClose = document.querySelectorAll('.card-popup__close')
if (cardClose.length > 0) {
	for (let index = 0; index < cardClose.length; index++) {
		const el = cardClose[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.card-popup'))
			e.preventDefault()
		})
	}
}

api.getCats()
	.then(res => res.json())
	.then(data => {
		if (data.message === "ok") {
			const obj = data.data
			obj.forEach((cat) => {
				if (cat.id) {
					const boxing = document.querySelector(".cats-popup__box");
					let cards = `<div class="cats-popup__card">
					<div class="cats-popup__column">
						<div class="cats-popup__image" style="background-image: url(${cat.img_link || "images/cat.jpg"})" ></div >
					</div >
					<div class="cats-popup__column">
						<div class="cats-popup__name">Кличка:<span>${cat.name}</span></div>
						<div class="cats-popup__id">id: <span>${cat.id}</span></div>
						<div class="cats-popup__age">Возраст:<span>${cat.age}</span></div>
						<div class="cats-popup__raiting">Рейтинг: <span>${cat.rate}</span></div>
					</div>
					<div class="cats-popup__column">
						<div class="cats-popup__description">О коте: ${cat.description}</div>
						<div class="cats-popup__like">В почёте:<span>${cat.favourite ? "Да" : "Нет"}</span></div>
					</div>
				</div > `;
					boxing.innerHTML += cards;
				}
			})
		}
	})
const icon = document.querySelector('.header__logo')
icon.addEventListener('click', function (e) {
	const curentPopu = document.getElementById('cats')
	popupOpen(curentPopu)
	e.preventDefault()
})
const cardsClose = document.querySelectorAll('.cats-popup__close')
if (cardsClose.length > 0) {
	for (let index = 0; index < cardsClose.length; index++) {
		const el = cardsClose[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.cats-popup'))
			e.preventDefault()
		})
	}
}
const login = document.querySelector('.header__login')
login.addEventListener('click', function (e) {
	const curentPopu = document.getElementById('login')
	popupOpen(curentPopu)
	e.preventDefault()
})
const loginClose = document.querySelectorAll('.login-popup__close')
if (loginClose.length > 0) {
	for (let index = 0; index < loginClose.length; index++) {
		const el = loginClose[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.login-popup'))
			e.preventDefault()
		})
	}
}

const input = document.querySelector('.form-login__button')
const value = document.querySelector('.form-login__email')
const forms = document.querySelector('.form-login')
input.addEventListener("click", (e) => {
	e.preventDefault();
	const curentPopu = document.getElementById('login')
	if (!(document.cookie = `${value.value}=login`)) {
		if (!(value.value === "")) {
			document.cookie = `${value.value}=login`
			popupClose(el.closest('.login-popup'))
		}
	} else {
		popupClose(curentPopu)
		forms.reset()
	}
})


const change = document.querySelector('.card-popup__button_put')
change.addEventListener('click', function (e) {
	const curentPopuq = document.getElementById('popup-change')
	popupOpen(curentPopuq)
	e.preventDefault()
})





const changeClose = document.querySelectorAll('.close-change-popup')
if (changeClose.length > 0) {
	for (let index = 0; index < changeClose.length; index++) {
		const el = changeClose[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup-change'))
			e.preventDefault()
		})
	}
}

const checkboxChange = document.querySelector(".popup-change__pet");
const checkboxChangeParent = document.querySelector('.popup-change__checkbox')

checkboxChangeParent.addEventListener('click', function () {
	if (checkboxChange.checked == false) {
		checkboxChangeParent.classList.add('active')
		checkboxChange.checked = true
	} else {
		checkboxChangeParent.classList.remove('active')
		checkboxChange.checked = false
	}
})


const formTwo = document.forms[2];
formTwo.addEventListener("submit", (e) => {
	e.preventDefault();
	console.log('2');
	catsData.forEach(el => {
		const nameButton = document.querySelector('.popup-change__name')
		if (el.name == nameButton.value) {
			const buttonId = el.id
			const body = {};
			for (let i = 0; i < formTwo.elements.length; i++) {
				let inp = formTwo.elements[i];
				if (inp.type === "checkbox") {
					body[inp.name] = inp.checked;
				} else if (inp.name && inp.value) {
					if (inp.type === "number") {
						body[inp.name] = +inp.value;
					} else {
						body[inp.name] = inp.value;
					}
				}
			}
			console.log(body);
			api.updCat(buttonId, body)
				.then(res => res.json())
				.then(data => {
					console.log(data.data);
					formTwo.reset();
					const popup = document.querySelector('.popup-change')
					popupClose(popup);
					if (data.message === "ok") {
						localStorage.clear()
						api.getCats()
							.then(res => res.json())
							.then(data => {
								console.log(data);
								if (data.message === "ok") {
									localStorage.setItem("cats", JSON.stringify(data.data));
									catsData = [...data.data];
								}
							})
					}
				})
		}
	})
})
