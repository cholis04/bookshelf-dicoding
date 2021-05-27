let keyword = document.getElementById('keyword')
let btnSearch = document.getElementById('search-btn')
let btnAdd = document.getElementById('add-btn')
let modalEdit = document.getElementById('modal')
let formAdd = document.getElementById('form-add')
let formEdit = document.getElementById('form-edit')
let readingList = document.getElementById('reading-list')
let finishedList = document.getElementById('finished-list')
let finishNum = document.getElementById('finish-num')
let readNum = document.getElementById('read-num')

const localStorageKey = 'bookshelf_1220029920398490192039'

/* FUNCTION */
function showData(id) {
  const data = JSON.parse(localStorage.getItem(localStorageKey))
  const currentData = data.filter((i) => i.id === id)

  /* INPUT EDIT */
  document.getElementById('book-id').value = currentData[0].id
  document.getElementById('title-edit').value = currentData[0].title
  document.getElementById('author-edit').value = currentData[0].author
  document.getElementById('year-edit').value = currentData[0].year
}

function setNumberTitle() {
  const data = JSON.parse(localStorage.getItem(localStorageKey))
  let tempData = null
  let keywordValue = keyword.value

  if (keywordValue !== null) {
    tempData = data.filter((book) => {
      const keyword = keywordValue.toLowerCase()
      const title_book = book.title.toLowerCase()
      let check = title_book.includes(keyword)
      if (check) {
        return book
      }
      return false
    })
  } else {
    tempData = data
  }

  const finishBox = tempData.filter((i) => i.isComplete === true)
  const readBox = tempData.filter((i) => i.isComplete === false)

  finishNum.innerText = finishBox.length
  readNum.innerText = readBox.length

  if (finishBox.length === 0) {
    finishedList.innerHTML = `
    <div class="empty-data">
      <p>The bookshelf still looks empty</p>
    </div>
  `
  }
  if (readBox.length === 0) {
    readingList.innerHTML = `
      <div class="empty-data">
        <p>The bookshelf still looks empty</p>
      </div>
    `
  }
}

function moveBook(id) {
  const data = JSON.parse(localStorage.getItem(localStorageKey))
  const currentData = data.filter((i) => i.id === id)
  const clearData = data.filter((i) => i.id !== id)

  const moveData = {
    id: currentData[0].id,
    title: currentData[0].title.toString().trim(),
    author: currentData[0].author.toString().trim(),
    year: currentData[0].year,
    isComplete: !currentData[0].isComplete
  }

  // TEMP Variable
  let tempContainer = ``
  let tempButton = ``
  let tempDialog = ``

  if (currentData[0].isComplete) {
    tempContainer = 'reading-list'
    tempButton = `<button class="finished-btn" data-id="${moveData.id}">Finished</button>`
    tempDialog = window.confirm(
      `Move "${currentData[0].title}" to Reading List ? `
    )
  } else {
    tempContainer = 'finished-list'
    tempButton = `<button class="reading-btn" data-id="${moveData.id}">Move to Reading Books</button>`
    tempDialog = window.confirm(
      `Already finished reading "${currentData[0].title}" ? `
    )
  }

  if (tempDialog) {
    clearData.unshift(moveData)
    localStorage.setItem(localStorageKey, JSON.stringify(clearData))

    document.getElementById(id).remove()

    const box = document.getElementById(tempContainer)
    const newBox = document.createElement('div')
    const list = box.children[0]

    newBox.className = 'box'
    newBox.setAttribute('id', moveData.id)
    newBox.innerHTML = `
        <header>
          <h5 class="title">${moveData.title}</h5>
          <p class="year">${moveData.year}</p>
        </header>
        <p class="author">${moveData.author}</p>
        <div class="action">
        ${tempButton}
          <div class="wrap-action">
              <a class="btn-edit" data-id="${moveData.id}">Edit</a>
              <a class="btn-remove" data-id="${moveData.id}">Remove</a>
          </div>
        </div>
      `

    if (list.classList.contains('empty-data')) {
      list.remove()
      const newBoxList = document.createElement('div')
      newBoxList.className = 'box-list'
      box.appendChild(newBoxList)
      newBoxList.insertBefore(newBox, newBoxList.childNodes[0])
    } else {
      list.scrollTop = 0
      list.insertBefore(newBox, list.childNodes[0])
    }
    setNumberTitle()
  }
}

function initialRenderList(val) {
  const data = JSON.parse(localStorage.getItem(localStorageKey))
  let tempData = null

  if (val !== null) {
    tempData = data.filter((book) => {
      const keyword = val.toLowerCase()
      const title_book = book.title.toLowerCase()
      let check = title_book.includes(keyword)
      if (check) {
        return book
      }
      return false
    })
  } else {
    tempData = data
  }

  const finishedData = tempData.filter((i) => i.isComplete === true)
  const readingData = tempData.filter((i) => i.isComplete === false)

  finishNum.innerText = finishedData.length
  readNum.innerText = readingData.length

  // GET DATA FINISHED
  if (finishedData.length > 0) {
    let displayData = `<div class="box-list">`
    finishedData.forEach((data) => {
      displayData += `
      <div class="box" id="${data.id}">
          <header>
              <h5 class="title">${data.title}</h5>
              <p class="year">${data.year}</p>
          </header>
          <p class="author">${data.author}</p>
          <div class="action">
              <button class="reading-btn" data-id="${data.id}">Move to Reading Books</button>
              <div class="wrap-action">
                  <a class="btn-edit" data-id="${data.id}">Edit</a>
                  <a class="btn-remove" data-id="${data.id}">Remove</a>
              </div>
          </div>
      </div>
      `
    })

    displayData += `</div>`
    finishedList.innerHTML = displayData
  } else {
    finishedList.innerHTML = `
      <div class="empty-data">
        <p>The bookshelf still looks empty</p>
      </div>
    `
  }

  // GET DATA READING
  if (readingData.length > 0) {
    let displayData = `<div class="box-list">`
    readingData.forEach((data) => {
      displayData += `
      <div class="box" id="${data.id}">
          <header>
              <h5 class="title">${data.title}</h5>
              <p class="year">${data.year}</p>
          </header>
          <p class="author">${data.author}</p>
          <div class="action">
              <button class="finished-btn" data-id="${data.id}">Finished</button>
              <div class="wrap-action">
                  <a class="btn-edit" data-id="${data.id}">Edit</a>
                  <a class="btn-remove" data-id="${data.id}">Remove</a>
              </div>
          </div>
      </div>
      `
    })

    displayData += `</div>`
    readingList.innerHTML = displayData
  } else {
    readingList.innerHTML = `
      <div class="empty-data">
        <p>The bookshelf still looks empty</p>
      </div>
    `
  }
}

function actionListListener() {
  let shelf = document.getElementById('shelf')
  shelf.addEventListener('click', function (e) {
    e.preventDefault()

    if (e.target.className === 'btn-edit') {
      const id = parseInt(e.target.dataset.id)
      showData(id)
      modalEdit.style.display = 'flex'
      document.getElementById('title-edit').focus()
    }

    if (e.target.className === 'btn-remove') {
      const id = parseInt(e.target.dataset.id)
      removeData(id)
    }

    if (e.target.className === 'reading-btn') {
      const id = parseInt(e.target.dataset.id)
      moveBook(id)
    }

    if (e.target.className === 'finished-btn') {
      const id = parseInt(e.target.dataset.id)
      moveBook(id)
      setNumberTitle()
    }
  })
}

function renderBox(data) {
  let box = document.getElementById(data.id)

  let titleDOM = box.getElementsByClassName('title')[0]
  let authorDOM = box.getElementsByClassName('author')[0]
  let yearDOM = box.getElementsByClassName('year')[0]

  titleDOM.innerText = data.title
  yearDOM.innerText = data.year
  authorDOM.innerText = data.author
}

function addData(newData) {
  const data = JSON.parse(localStorage.getItem(localStorageKey))
  data.unshift(newData)
  localStorage.setItem(localStorageKey, JSON.stringify(data))

  let tempButton = ``
  let tempContainer = ``

  if (newData.isComplete) {
    tempContainer = 'finished-list'
    tempButton = `<button class="reading-btn" data-id="${newData.id}">Move to Reading Books</button>`
  } else {
    tempContainer = 'reading-list'
    tempButton = `<button class="finished-btn" data-id="${newData.id}">Finished</button>`
  }

  const box = document.getElementById(tempContainer)
  const newBox = document.createElement('div')
  newBox.className = 'box'
  newBox.setAttribute('id', newData.id)
  newBox.innerHTML = `
        <header>
          <h5 class="title">${newData.title}</h5>
          <p class="year">${newData.year}</p>
        </header>
        <p class="author">${newData.author}</p>
        <div class="action">
        ${tempButton}
          <div class="wrap-action">
              <a class="btn-edit" data-id="${newData.id}">Edit</a>
              <a class="btn-remove" data-id="${newData.id}">Remove</a>
          </div>
        </div>
    `

  const list = box.children[0]
  if (list.classList.contains('empty-data')) {
    list.remove()
    const newBoxList = document.createElement('div')
    newBoxList.className = 'box-list'
    box.appendChild(newBoxList)
    newBoxList.insertBefore(newBox, newBoxList.childNodes[0])
  } else {
    list.scrollTop = 0
    list.insertBefore(newBox, list.childNodes[0])
  }
  setNumberTitle()
}

function editData(updateData) {
  const data = JSON.parse(localStorage.getItem(localStorageKey))
  const prevData = data.filter((book) => book.id === updateData.id)
  const checkData = {
    id: prevData[0].id,
    title: prevData[0].title,
    author: prevData[0].author,
    year: prevData[0].year
  }

  const update = data.map((book) => {
    let temp = null
    if (book.id === updateData.id) {
      temp = {
        id: updateData.id,
        title: updateData.title,
        author: updateData.author,
        year: updateData.year,
        isComplete: book.isComplete
      }
    } else {
      temp = book
    }
    return temp
  })

  if (JSON.stringify(updateData) === JSON.stringify(checkData)) {
    modalEdit.style.display = 'none'
  } else {
    localStorage.setItem(localStorageKey, JSON.stringify(update))
    renderBox(updateData)
    modalEdit.style.display = 'none'
  }
}

function removeData(id) {
  const data = JSON.parse(localStorage.getItem(localStorageKey))
  const filteredData = data.filter((book) => book.id === id)
  const clearedData = data.filter((book) => book.id !== id)

  const confirm = window.confirm(
    `Delete book "${filteredData[0].title}" ?\n\n\nWARNING : This action can't be undone!`
  )
  if (confirm) {
    localStorage.setItem(localStorageKey, JSON.stringify(clearedData))
    document.getElementById(id).remove()
    setNumberTitle()
  }
}

/* END FUNCTION */
/*################################################################################################### */
/* BEGINING ONLOAD */

window.addEventListener('load', function () {
  let scrollToAdd = document.getElementById('jump-to-add')

  if (typeof Storage !== 'undefined') {
    if (localStorage.getItem(localStorageKey) === null) {
      let empty = []
      localStorage.setItem(localStorageKey, JSON.stringify(empty))
    }
  } else {
    alert('The browser you are using does not support Web Storage')
  }

  initialRenderList(null)

  actionListListener()

  scrollToAdd.addEventListener('click', function () {
    document.getElementById('title').focus()
    formAdd.scrollIntoView()
  })

  keyword.addEventListener('input', function (e) {
    let value = e.target.value
    if (value === '') {
      btnSearch.disabled = true
      initialRenderList(null)
      btnAdd.disabled = false
    } else {
      initialRenderList(value)
      btnSearch.disabled = false
      btnAdd.disabled = true
    }
  })

  btnSearch.addEventListener('click', function (e) {
    e.preventDefault()
    keyword.value = ''
    this.disabled = true
    btnAdd.disabled = false
    initialRenderList(null)
  })

  modalEdit.addEventListener('click', function (e) {
    if (e.target.id === 'modal') {
      /* INPUT EDIT */
      document.getElementById('book-id').value = ''
      document.getElementById('title-edit').value = ''
      document.getElementById('author-edit').value = ''
      document.getElementById('year-edit').value = ''
      /* INPUT EDIT */
      this.style.display = 'none'
    }
  })

  formAdd.addEventListener('submit', function (e) {
    e.preventDefault()

    /* DATA INPUT */
    let title = document.getElementById('title').value
    let author = document.getElementById('author').value
    let year = document.getElementById('year').value
    let isComplete = document.getElementById('isComplete').checked

    let id = new Date().getTime()

    let newData = {
      id,
      title: title.toString().trim(),
      author: author.toString().trim(),
      year: parseInt(year),
      isComplete
    }

    addData(newData)
    this.reset()
    if (isComplete) {
      document.getElementById('finished').scrollIntoView()
    } else {
      document.getElementById('reading').scrollIntoView()
    }
  })

  formEdit.addEventListener('submit', function (e) {
    e.preventDefault()
    let book_id = document.getElementById('book-id').value
    let title = document.getElementById('title-edit').value
    let author = document.getElementById('author-edit').value
    let year = document.getElementById('year-edit').value

    let updateData = {
      id: parseInt(book_id),
      title: title.toString().trim(),
      author: author.toString().trim(),
      year: parseInt(year)
    }

    editData(updateData)
    this.reset()
  })
})
/* END  ONLOAD */
