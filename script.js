const links = document.querySelectorAll('li')
const sections = document.querySelectorAll('section')
const form = document.querySelector('form')
const amountInput = document.querySelector('[name="amount"]')
const labelElement = document.querySelector('label[name="current"]')
const currentInput = document.querySelector('[name="current"]')
const errorMessage = document.querySelector('.error')
const addBtn = document.querySelector('#add-btn')
const clearBtn = document.querySelector('#clear-btn')
const table = document.querySelector('table')
const tbody = document.querySelector('tbody')
const ls = localStorage
let transactions = JSON.parse(ls.getItem('transact')) || []

const amountMoney = {
  doll: 0,
  eur: 0,
  uah: 0,
}

for (const link of links) {
  link.onclick = viewDisplay
}

addBtn.onclick = addTransaction
clearBtn.onclick = clearLs
tbody.onclick = deleteTransaction

renderTransTable()
renderCapital()

function addTransaction(event) {
  event.preventDefault()
  let isValid = true;

  if (isNaN(form.amount.value) || form.amount.value <1) {
    form.amount.value = 'Only numbers'
    isValid = false;
    addInvalidClass(form.amount)
  }

  if (!form.amount.value) {
    amountInput.value = 'Input is empty'
    isValid = false;
    addInvalidClass(form.amount)
  }

  if (!form.currency.value) {
    isValid = false;
    currentInput.style = "color: red"

    setTimeout(() => {
      currentInput.style = "color: black"
    }, 1000)
  }

  if (!form.date.value) {
    isValid = false;
    addInvalidClass(form.date)
  }

  else if (isValid) {
    const { amount: { value: amount }, currency: { value: currency }, date: { value: date } } = form

    transactions.push({ amount: +amount, currency, date })

    // let newTransaction = {
    //   amount: form.amount.value,
    //   currency: form.currency.value,
    //   date: form.date.value,
    // }
    // transactions.push(newTransaction)

    form.reset()

    addLocalStorage()
  }
}

function renderTransTable() {
  tbody.innerHTML = ''

  for (const { amount, currency, date } of transactions) {
    tbody.innerHTML += `
      <tr>
        <td>${formatCurrency(amount)}</td>
        <td>${currency}</td>
        <td>${date}</td>
        <td><button class="remove-btn">x</button>
      </tr>
    `
  }
}

function addLocalStorage() {
  let transToString = JSON.stringify(transactions)

  ls.setItem('transact', transToString)
  renderTransTable()
  renderCapital()
}

function viewDisplay(event) {
  let id = event.target.getAttribute('data-section')

  for (const section of sections) {
    section.hidden = section.id != id

    // section.hidden = section.id == id ? false : true

    // if (section.id == id) {
    //   section.hidden = false
    // }
    // else {
    //   section.hidden = true
    // }
  }
}

function clearLs() {
  ls.removeItem('transact')
  transactions = []

  tbody.innerHTML = ''

  renderCapital()
  renderTransTable()
}

function deleteTransaction({ target }) {
  if (target.classList.contains('remove-btn')) {
    const row = target.closest('tr')
    const rowIndex = row.rowIndex - 1

    transactions.splice(rowIndex, 1)
    renderTransTable()
    ls.setItem('transact', JSON.stringify(transactions))
    renderCapital()
  }
}

function renderCapital() {
  let [, dollarSpan, euroSpan, uahSpan] = document.querySelectorAll('span')
  let dollCount = 0;
  let euroCount = 0;
  let uahCount = 0

  for (let { currency, amount } of transactions) {
    if (currency == '$') dollCount += amount
    if (currency == '€') euroCount += amount
    if (currency == '₴') uahCount += amount
  }

  dollarSpan.innerText = formatCurrency(dollCount)
  euroSpan.innerText = formatCurrency(euroCount)
  uahSpan.innerText = formatCurrency(uahCount)

}

function addInvalidClass(input) {

  input.classList.add('invalid')

  setTimeout(() => {
    amountInput.value = ''
    input.classList.remove('invalid')
  }, 1000)
}

function formatCurrency(currency) {
  return currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}