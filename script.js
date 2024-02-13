const links = document.querySelectorAll('li')
const sections = document.querySelectorAll('section')
const form = document.querySelector('form')
const labelElement = document.querySelector('label[name="current"]')
const errorMessage = document.querySelector('.error')
const deleteBtn = document.querySelector('#delete-btn')
const clearBtn = document.querySelector('#clearBtn')
const tbody = document.querySelector('tbody')
const ls = localStorage
let transactions = JSON.parse(ls.getItem('transact')) || []

const amountMoney = {
  doll: 0,
  eur: 0,
  uah: 0,
}

for (link of links) {
  link.onclick = viewDisplay
}

deleteBtn.onclick = addTransaction
clearBtn.onclick = clearLs
tbody.onclick = deleteTransaction

renderTransTable()
renderCapital()

function addTransaction(event) {
  event.preventDefault()
  let isValid = true;

  if (!form.amount.value) {
    isValid = false;

    form.amount.classList.add('invalid')
    // form.amount.parentElement.style = "color: red"

    setTimeout(() => {
      form.amount.classList.remove('invalid')
      // form.amount.parentElement.style = "color: red"
    }, 1000)
  }

  if (!form.currency.value) {
    isValid = false;
    labelElement.style = "color: red"

    setTimeout(() => {
      labelElement.style = "color: black"
    }, 1000)
  }

  else if (isValid) {
    let newTransaction = {
      amount: form.amount.value,
      currency: form.currency.value,
    }

    transactions.push(newTransaction)
    form.reset()

    addLocalStorage()
  }
}

function renderTransTable() {
  tbody.innerHTML = ''
  for (item of transactions) {
    tbody.innerHTML += `
    <tr>
    <td>${item.amount}</td>
    <td>${item.currency}</td>
    <td><button class="remove-btn">x</button>
    </tr>
    `
  }
}

function addLocalStorage() {
  let transToString = JSON.stringify(transactions)

  ls.setItem('transact', transToString)
  renderTransTable()
}

function viewDisplay(event) {
  let attribute = event.target.getAttribute('data-section')

  for (section of sections) {

    if (section.id == attribute) {

      section.hidden = false
    }

    else {
      section.hidden = true
    }

  }
}

function clearLs() {
  ls.clear()

  tbody.innerHTML = ''
}

function deleteTransaction(event) {
  if (event.target.classList.contains('remove-btn')) {
    const row = event.target.closest('tr')
    const rowIndex = row.rowIndex -1 
    
    transactions.splice(rowIndex, 1)
    renderTransTable()
    ls.setItem('transact', JSON.stringify(transactions))
  }
}

function renderCapital() {
  let [, dollarSpan, euroSpan, uahSpan, ] = document.querySelectorAll('span')
  let dollCount = 0;
  let euroCount = 0;
  let uahCount = 0

  for (let transaction of transactions) {
  if (transaction.currency == '$') dollCount += (+transaction.amount)
  if (transaction.currency == '€') euroCount += (+transaction.amount)
  if (transaction.currency == '₴') uahCount += (+transaction.amount)
}

dollarSpan.innerHTML = dollCount
euroSpan.innerText = euroCount
uahSpan.innerHTML = uahCount
}


// for (let transaction of transactions) {
//   if (transaction.currency == '$') dollCount += transaction.currency
//   if (transaction.currency == '€') euroCount += transaction.currency
//   if (transaction.currency == '₴') uahCount += transaction.currency
// }

// dollarSpan.innerHTML = dollCount
// euroSpan.innerHTML = euroCount
// uahSpan.innerHTML = uahCount