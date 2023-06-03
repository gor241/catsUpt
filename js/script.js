const main = document.querySelector(".cats__cards");
const popupLinks = document.querySelectorAll(".popup-link");
const body = document.querySelector("body");
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;
const timeout = 800;

// назначение на кнопку плюс открытие окна добавления кота
if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    let popupLink = popupLinks[index];
    popupLink.addEventListener("click", function (e) {
      const popupName = popupLink.getAttribute("href").replace("#", "");
      const curentPopup = document.getElementById(popupName);
      popupOpen(curentPopup);
      e.preventDefault();
    });
  }
}

// назначение на кнопку крестик закрытие окна добавления кота
const popupCloseIcon = document.querySelectorAll(".close-popup");
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index];
    el.addEventListener("click", function (e) {
      popupClose(el.closest(".popup"));
      e.preventDefault();
    });
  }
}

// если один поп-ап открыт , другие закрываются
function popupOpen(curentPopup) {
  if (curentPopup && unlock) {
    const popupActive = document.querySelector(".popup.open");
    const cardPopup = document.querySelector(".card-popup.open");
    const catsPopup = document.querySelector(".cats-popup.open");
    const loginPopup = document.querySelector(".login-popup.open");
    const changePopup = document.querySelector(".popup-change.open");
    if (popupActive) {
      popupClose(popupActive, false);
    } else if (cardPopup) {
      popupClose(cardPopup, false);
    } else if (catsPopup) {
      popupClose(catsPopup, false);
    } else if (changePopup) {
      popupClose(changePopup, false);
    } else if (loginPopup) {
      popupClose(loginPopup, false);
    } else {
      bodyLock();
    }
    curentPopup.classList.add("open");
    curentPopup.addEventListener("click", function (e) {
      el = e.target;
      if (
        !el.closest(".popup__content") &&
        !el.closest(".card-popup__content") &&
        !el.closest(".cats-popup__content") &&
        !el.closest(".login-popup__content") &&
        !el.closest(".popup-change__content")
      ) {
        if (el.closest(".popup")) {
          popupClose(el.closest(".popup"));
        } else if (el.closest(".card-popup")) {
          popupClose(el.closest(".card-popup"));
        } else if (el.closest(".login-popup")) {
          popupClose(el.closest(".login-popup"));
        } else if (el.closest(".cats-popup")) {
          popupClose(el.closest(".cats-popup"));
        } else popupClose(el.closest(".popup-change"));
      }
    });
  }
}

// закрыте поп-апа
function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove("open");
    if (doUnlock) {
      bodyUnlock();
    }
  }
}

// Дальше функции для фиксации окна без дёрганья при убирания ползунка прокрутки
function bodyLock() {
  const lockPaddingValue =
    window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
  if (lockPadding.length > 0) {
    for (let i = 0; i < lockPadding.length; i++) {
      const el = lockPadding[i];
      el.style.paddingRight = lockPaddingValue;
    }
  }
  body.style.paddingRight = lockPaddingValue;
  body.classList.add("lock");

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}
function bodyUnlock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = "0px";
      }
    }
    body.style.paddingRight = "0px";
    body.classList.remove("lock");
  }, timeout);
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

// нажатие esc во всех поп-апах закрывает поп-ап
document.addEventListener("keydown", function (e) {
  if (e.which === 27) {
    const popupActive = document.querySelector(".popup.open");
    const popupCard = document.querySelector(".card-popup.open");
    const popupCats = document.querySelector(".cats-popup.open");
    const loginCats = document.querySelector(".login-popup.open");
    const changePopup = document.querySelector(".popup-change.open");
    if (popupActive) {
      popupClose(popupActive);
    } else if (popupCard) {
      popupClose(popupCard);
    } else if (loginCats) {
      popupClose(loginCats);
    } else if (changePopup) {
      popupClose(changePopup);
    } else {
      popupClose(popupCats);
    }
  }
});

// функция для кастомного ползунка чекбокса
const checkbox = document.querySelector(".popup__pet");
const checkboxParent = document.querySelector(".popup__checkbox");

checkboxParent.addEventListener("click", function () {
  if (checkbox.checked == false) {
    checkboxParent.classList.add("active");
    checkbox.checked = true;
  } else {
    checkboxParent.classList.remove("active");
    checkbox.checked = false;
  }
});

const api = new Api("RuslanNuriev"); // мое уникальное имя!! Использовать свое!
let form = document.forms[0]; // форма добавления кота
// При добавлении в инпут ссылке, подставляется в окно задним фоном
const imgLin = document.querySelector(".popup__image");
form.image.addEventListener("change", (e) => {
  imgLin.style.backgroundImage = `url(${e.target.value})`;
});
const clearLink = document.querySelector(".popup__link");
const clearButton = document.getElementById("clearButton");
form.image.addEventListener("input", (e) => {
  imgLin.style.backgroundImage = `url(${e.target.value})`;
  if (e.target.value.length > 0) {
    clearButton.style.display = "block";
  } else {
    clearButton.style.display = "none";
  }
});
clearButton.addEventListener("click", function () {
  clearLink.value = "";
  clearButton.style.display = "none";
  imgLin.style.backgroundImage = "";
});

// Действия при отправке кота на сервер
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
  api
    .addCat(body)
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      if (data) {
        form.reset();
        imgLin.style.backgroundImage = "../images/cat.jpg";
        const popup = document.querySelector(".popup");
        popupClose(popup);
        api
          .getCat(body.id)
          .then((res) => res.json())
          .then((cat) => {
            if (cat) {
              catsData = [...catsData, cat];
              localStorage.setItem("cats", JSON.stringify(catsData));
              getsCats(api, catsData);
              const item = localStorage.getItem("cats");
              const changeArr = JSON.parse(item);
              const boxing = document.querySelector(".cats-popup__box");
              boxing.innerHTML = "";
              changeArr.forEach((cat) => {
                if (cat.id) {
                  const boxing = document.querySelector(".cats-popup__box");
                  let cards = `<div class="cats-popup__card">
                  <div class="cats-popup__column">
                    <div class="cats-popup__image" style="background-image: url(${
                      cat.image || "images/cat.jpg"
                    })" ></div >
                  </div >
                  <div class="cats-popup__column">
                    <div class="cats-popup__name">Кличка:<span>${
                      cat.name
                    }</span></div>
                    <div class="cats-popup__id">id: <span>${cat.id}</span></div>
                    <div class="cats-popup__age">Возраст:<span>${
                      cat.age
                    }</span></div>
                    <div class="cats-popup__raiting">Рейтинг: <span>${
                      cat.rate
                    }</span></div>
                  </div>
                  <div class="cats-popup__column">
                    <div class="cats-popup__description">О коте: ${
                      cat.description
                    }</div>
                    <div class="cats-popup__like">В почёте:<span>${
                      cat.favourite ? "Да" : "Нет"
                    }</span></div>
                  </div>
                </div > `;
                  boxing.innerHTML += cards;
                }
              });
            } else {
              console.log(cat);
            }
          });
      } else {
        console.log(data);
        api
          .getIds()
          .then((r) => r.json())
          .then((d) => console.log(d));
      }
    });
});

// Обновление карточек
const updCards = function (data) {
  main.innerHTML = "";
  data.forEach((cat) => {
    if (cat.id) {
      let card = `<div class="${
        cat.favourite ? "cats__card like" : "cats__card popup-link"
      }" style="background-image:
	url(${cat.image || "images/cat.jpg"})">
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
};

// Добавление карточек
const getCats = function (api) {
  api
    .getCats()
    .then((res) => res.json())
    .then((data) => {
      updCards(data);
    });
};
getCats(api);

// Добавление карточек в localStorage, что бы при перезагрузки страницы, не пропадали карточки
let catsData = localStorage.getItem("cats");
catsData = catsData ? JSON.parse(catsData) : [];
const getsCats = function (api, store) {
  if (!store.length) {
    api
      .getCats()
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          localStorage.setItem("cats", JSON.stringify(data));
          catsData = [...data];
          updCards(data);
        }
      });
  } else {
    updCards(store);
  }
};
getsCats(api, catsData);

// Добавляет событие на каждую из карточек, при нажатии открыть поп-ап с подробностями
const formTwo = document.querySelector(".popup-change__form");
main.addEventListener("click", function (e) {
  const el = e.target;
  const card = el.textContent.trim();
  if (el.closest(".cats__card")) {
    const curentPopup = document.getElementById("card-popup");
    popupOpen(curentPopup);
    e.preventDefault();
    const img = document.querySelector(".card-popup__image");
    img.style.backgroundImage = el.style.backgroundImage;
    // const url = el.style.backgroundImage.replace(/^[url("]+|[")]+$/g, "");
    catsData.forEach((e) => {
      if (card === e.name) {
        const name = document.querySelector(".card-popup__name span");
        const age = document.querySelector(".card-popup__age span");
        const description = document.querySelector(
          ".card-popup__description span"
        );
        const rate = document.querySelector(".card-popup__raiting span");
        const like = document.querySelector(".card-popup__like span");
        name.innerHTML = e.name;
        age.innerHTML = e.age;
        description.innerHTML = e.description;
        rate.innerHTML = e.rate;
        if (e.favourite) {
          like.innerHTML = "Да";
        } else {
          like.innerHTML = "Нет";
        }
      }
    });
    if (curentPopup.classList.contains("open")) {
      const delCatButton = document.querySelector(".card-popup__button_del");
      delCatButton.addEventListener(
        "click",
        function (e) {
          catsData.forEach((e) => {
            if (card === e.name) {
              api
                .delCat(e.id)
                .then((res) => res.json())
                .then((data) => {
                  console.log(data);
                  popupClose(curentPopup);
                  if (data) {
                    alert(`Кот ${e.name} удалён`);
                    const item = localStorage.getItem("cats");
                    const notDelArr = JSON.parse(item).filter(
                      (el) => el.id !== e.id
                    );
                    localStorage.clear();
                    localStorage.setItem("cats", JSON.stringify(notDelArr));
                    updCards(notDelArr);
                    const boxing = document.querySelector(".cats-popup__box");
                    boxing.innerHTML = "";
                    notDelArr.forEach((cat) => {
                      if (cat.id) {
                        let cards = `<div class="cats-popup__card">
                        <div class="cats-popup__column">
                          <div class="cats-popup__image" style="background-image: url(${
                            cat.image || "images/cat.jpg"
                          })" ></div >
                        </div >
                        <div class="cats-popup__column">
                          <div class="cats-popup__name">Кличка:<span>${
                            cat.name
                          }</span></div>
                          <div class="cats-popup__id">id: <span>${
                            cat.id
                          }</span></div>
                          <div class="cats-popup__age">Возраст:<span>${
                            cat.age
                          }</span></div>
                          <div class="cats-popup__raiting">Рейтинг: <span>${
                            cat.rate
                          }</span></div>
                        </div>
                        <div class="cats-popup__column">
                          <div class="cats-popup__description">О коте: ${
                            cat.description
                          }</div>
                          <div class="cats-popup__like">В почёте:<span>${
                            cat.favourite ? "Да" : "Нет"
                          }</span></div>
                        </div>
                      </div > `;
                        boxing.innerHTML += cards;
                      }
                    });
                  }
                });
            }
          });
          e.preventDefault();
        },
        { once: true }
      );
      const changeCatButton = document.querySelector(".card-popup__button_put");
      changeCatButton.addEventListener(
        "click",
        function (e) {
          const item = localStorage.getItem("cats");
          catsData = JSON.parse(item);
          catsData.forEach((e) => {
            if (card === e.name) {
              const image = document.querySelector(".popup-change__image");
              const name = document.querySelector(".popup-change__name");
              const age = document.querySelector(".popup-change__age");
              const area = document.querySelector(".popup-change__area");
              const reit = document.querySelector(".popup-change__raiting");
              const like = document.querySelector(".popup-change__pet");
              const likePar = document.querySelector(".popup-change__checkbox");
              const url = document.querySelector(".popup-change__link");
              image.style.backgroundImage = `url(${e.image})`;
              name.value = e.name;
              age.value = e.age;
              url.value = e.image;
              area.value = e.description;
              reit.value = e.rate;
              if (e.favourite) {
                likePar.classList.add("active");
                like.checked = true;
              } else {
                likePar.classList.remove("active");
                like.checked = false;
              }
              const clearLinks = document.querySelector(".popup-change__link");
              const clearButtons = document.getElementById("clearButtons");
              if (url.value.length > 0) {
                clearButtons.style.display = "block";
              }
              formTwo.img_link.addEventListener("change", (e) => {
                image.style.backgroundImage = `url(${e.target.value})`;
              });
              formTwo.img_link.addEventListener("input", (e) => {
                image.style.backgroundImage = `url(${e.target.value})`;
                if (e.target.value.length > 0) {
                  clearButtons.style.display = "block";
                } else {
                  clearButtons.style.display = "none";
                }
              });
              clearButtons.addEventListener("click", function () {
                clearLinks.value = "";
                clearButtons.style.display = "none";
                image.style.backgroundImage = "";
              });
            }
          });
          e.preventDefault();
        },
        { once: true }
      );
    }
  }
});

const cardClose = document.querySelectorAll(".card-popup__close");
if (cardClose.length > 0) {
  for (let index = 0; index < cardClose.length; index++) {
    const el = cardClose[index];
    el.addEventListener("click", function (e) {
      popupClose(el.closest(".card-popup"));
      e.preventDefault();
    });
  }
}

// Код при нажатии на кнопку изменить кота
const change = document.querySelector(".card-popup__button_put");
change.addEventListener("click", function (e) {
  const curentPopuq = document.getElementById("popup-change");
  popupOpen(curentPopuq);
  e.preventDefault();
});

const changeClose = document.querySelectorAll(".close-change-popup");
if (changeClose.length > 0) {
  for (let index = 0; index < changeClose.length; index++) {
    const el = changeClose[index];
    el.addEventListener("click", function (e) {
      popupClose(el.closest(".popup-change"));
      e.preventDefault();
    });
  }
}

const checkboxChange = document.querySelector(".popup-change__pet");
const checkboxChangeParent = document.querySelector(".popup-change__checkbox");

checkboxChangeParent.addEventListener("click", function () {
  if (checkboxChange.checked == false) {
    checkboxChangeParent.classList.add("active");
    checkboxChange.checked = true;
  } else {
    checkboxChangeParent.classList.remove("active");
    checkboxChange.checked = false;
  }
});

formTwo.addEventListener("submit", (e) => {
  e.preventDefault();
  catsData.forEach((el) => {
    const nameButton = document.querySelector(".popup-change__name");
    if (el.name == nameButton.value) {
      const buttonId = el.id;
      const body = {};
      body.id = buttonId;
      for (let i = 0; i < formTwo.elements.length; i++) {
        let inp = formTwo.elements[i];
        if (inp.type === "checkbox") {
          body[inp.name] = inp.checked;
        }
        if (inp.name === "img_link") {
          body.image = inp.value;
        }
        if (inp.type === "number") {
          body[inp.name] = +inp.value;
        }
        body[inp.name] = inp.value;
      }
      api
        .updCat(buttonId, body)
        .then((res) => res.json())
        .then((data) => {
          formTwo.reset();
          const popup = document.querySelector(".popup-change");
          popupClose(popup);
          if (data) {
            alert(`Кот ${el.name} изменён`);
            const item = localStorage.getItem("cats");
            const changeArr = JSON.parse(item).filter((e) => el.id !== e.id);
            localStorage.clear();
            const addItemArr = [...changeArr, body];
            console.log(addItemArr);
            console.log(body);
            const boxing = document.querySelector(".cats-popup__box");
            boxing.innerHTML = "";
            addItemArr.forEach((cat) => {
              if (cat.id) {
                let cards = `<div class="cats-popup__card">
                <div class="cats-popup__column">
                  <div class="cats-popup__image" style="background-image: url(${
                    cat.image || "images/cat.jpg"
                  })" ></div >
                </div >
                <div class="cats-popup__column">
                  <div class="cats-popup__name">Кличка:<span>${
                    cat.name
                  }</span></div>
                  <div class="cats-popup__id">id: <span>${cat.id}</span></div>
                  <div class="cats-popup__age">Возраст:<span>${
                    cat.age
                  }</span></div>
                  <div class="cats-popup__raiting">Рейтинг: <span>${
                    cat.rate
                  }</span></div>
                </div>
                <div class="cats-popup__column">
                  <div class="cats-popup__description">О коте: ${
                    cat.description
                  }</div>
                  <div class="cats-popup__like">В почёте:<span>${
                    cat.favourite ? "Да" : "Нет"
                  }</span></div>
                </div>
              </div > `;
                boxing.innerHTML += cards;
              }
            });
            localStorage.setItem("cats", JSON.stringify(addItemArr));
            catsData = [...addItemArr];
            updCards(addItemArr);
          }
        });
    }
  });
});

// Добавление котов в список котов
api
  .getCats()
  .then((res) => res.json())
  .then((data) => {
    if (data) {
      const obj = data;
      obj.forEach((cat) => {
        if (cat.id) {
          const boxing = document.querySelector(".cats-popup__box");
          let cards = `<div class="cats-popup__card">
					<div class="cats-popup__column">
						<div class="cats-popup__image" style="background-image: url(${
              cat.image || "images/cat.jpg"
            })" ></div >
					</div >
					<div class="cats-popup__column">
						<div class="cats-popup__name">Кличка:<span>${cat.name}</span></div>
						<div class="cats-popup__id">id: <span>${cat.id}</span></div>
						<div class="cats-popup__age">Возраст:<span>${cat.age}</span></div>
						<div class="cats-popup__raiting">Рейтинг: <span>${cat.rate}</span></div>
					</div>
					<div class="cats-popup__column">
						<div class="cats-popup__description">О коте: ${cat.description}</div>
						<div class="cats-popup__like">В почёте:<span>${
              cat.favourite ? "Да" : "Нет"
            }</span></div>
					</div>
				</div > `;
          boxing.innerHTML += cards;
        }
      });
    }
  });

// Открытие и закрытие списка котов
const icon = document.querySelector(".header__logo");
icon.addEventListener("click", function (e) {
  const curentPopu = document.getElementById("cats");
  popupOpen(curentPopu);
  e.preventDefault();
});
const cardsClose = document.querySelectorAll(".cats-popup__close");
if (cardsClose.length > 0) {
  for (let index = 0; index < cardsClose.length; index++) {
    const el = cardsClose[index];
    el.addEventListener("click", function (e) {
      popupClose(el.closest(".cats-popup"));
      e.preventDefault();
    });
  }
}

// Заглушка вход
const login = document.querySelector(".header__login");
login.addEventListener("click", function (e) {
  const curentPopu = document.getElementById("login");
  popupOpen(curentPopu);
  e.preventDefault();
});
const loginClose = document.querySelectorAll(".login-popup__close");
if (loginClose.length > 0) {
  for (let index = 0; index < loginClose.length; index++) {
    const el = loginClose[index];
    const curentPopu = document.getElementById("login");
    el.addEventListener("click", function (e) {
      popupClose(curentPopu);
      e.preventDefault();
    });
  }
}

// Сам код для входа
const input = document.querySelector(".form-login__button");
const value = document.querySelector(".form-login__email");
const forms = document.querySelector(".form-login");
const nameHead = document.querySelector(".header__box");
input.addEventListener("click", (e) => {
  e.preventDefault();
  const curentPopu = document.querySelector(".login-popup");
  if (document.cookie === `login=${value.value}`) {
    alert(`${value.value} уже авторизован`);
    let cardLogin = `<div class="header__card">Здравствуйте:<span>${value.value}</span></div>`;
    nameHead.innerHTML += cardLogin;
    popupClose(curentPopu);
    forms.reset();
  } else {
    document.cookie = `login=${value.value}`;
    let cardLogin = `<div class="header__card">Здравствуйте:<span>${value.value}</span></div>`;
    nameHead.innerHTML += cardLogin;
    popupClose(curentPopu);
    forms.reset();
  }
});
window.onunload = function () {
  const check = document.getElementsByClassName("header__card");
  if (check) {
    check.parentNode.removeChild(check);
  }
};
