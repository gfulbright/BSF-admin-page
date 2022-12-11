import { useState, useRef, useEffect } from 'react';
import axios from 'axios'
import Tickets from './Tickets.jsx';
  let hidden =true;

const CurrentEntries = () => {

  const SECRET = process.env.REACT_APP_PASSCODE

  const [entryList, setEntryList] = useState([])


  // READ (GET)
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST}/api/read`).then((response) => {
      setEntryList(response.data)
    })
  }, [entryList])

  const [newEmail, setNewEmail] = useState('')
  const [passcode, setPasscode] = useState('')

  function getObjectByValue(objVal) {
    let objectWithValue = {}
    entryList.forEach(entry => {
      if (Object.values(entry).indexOf(objVal) > -1) { // email value is inside obj inside array
        console.log('entry', entry)
        objectWithValue = entry
      }
    })
    return objectWithValue
  }

  // DELETE
  const deleteEntry = (email) => { // deletes ALL such email instances in the database
    axios.delete(`${process.env.REACT_APP_HOST}/api/delete/${email}`).then((response) => {
      let objToDelete = getObjectByValue(email)
      const index = entryList.indexOf(objToDelete) // deletes ONE instance in the state var
      if (index > -1) {
        let entryListCopy = [...entryList] // copy
        entryListCopy.splice(index, 1) // remove index
        setEntryList(entryListCopy)
      }
    }) //close .then()
  }

  // UPDATE (PUT)
  const updateEmail = (email) => { // replaces ALL such email instances in the database
    axios.put(`${process.env.REACT_APP_HOST}/api/update`, { old: email, new: newEmail }).then((response) => {
      let objToChange = getObjectByValue(email)
      const index = entryList.indexOf(objToChange)  // deletes ONE instance in the state var
      objToChange.email_address = newEmail
      if (index > -1) {
        let entryListCopy = [...entryList]
        entryListCopy[index] = objToChange
        setEntryList(entryListCopy)
      }
    }) //close .then()

    setNewEmail('') // clear all update email input fields
    let updateInputs = document.getElementsByClassName('updateInput');
    for (let i = 0; i < updateInputs.length; i++) {
      updateInputs[i].value = ''
    }
  }

  const refPass = useRef(null);

  function login(e) {
    const collection = document.getElementsByClassName("editControls")
    const editButton = document.getElementById('editButton')
    const editPasscodeInput = document.getElementById('editPasscodeInput')
    
    setPasscode('');
    if (passcode === SECRET) {
      hidden=false;
      for (let i = 0; i < collection.length; i++)
        collection[i].style.display = 'block'
      editButton.style.display = 'none'
      editPasscodeInput.style.visibility = 'hidden'

    } else {
      for (let i = 0; i < collection.length; i++)
        collection[i].style.display = 'none'
      editButton.style.display = 'inline'
      editPasscodeInput.style.visibility = 'visible'
      editPasscodeInput.focus()
    }
    setPasscode('')
    refPass.current.value = ''
  }
  function handleEditList(e) {
    const collection = document.getElementsByClassName("editControls")
    const editButton = document.getElementById('editButton')
    const doneButton = document.getElementById('doneButton')
    const editPasscodeInput = document.getElementById('editPasscodeInput')
    //const logoutButton = document.getElementById('logoutButton')
    const submitEmailsButton = document.getElementById('submitEmailsButton')

      hidden=false;
      for (let i = 0; i < collection.length; i++)
        collection[i].style.display = 'block'
      doneButton.style.display = 'inline'
      editButton.style.display = 'none'
      //logoutButton.style.display = 'none'
      submitEmailsButton.style.display = 'none'

  
    setPasscode('')
  }

  function logout() {
    const editPasscodeInput = document.getElementById('editPasscodeInput')
    const editButton = document.getElementById('editButton')
    const doneButton = document.getElementById('doneButton')
    const collection = document.getElementsByClassName("editControls")
    const submitEmailsButton = document.getElementById('submitEmailsButton')
    hidden=true;
    for (let i = 0; i < collection.length; i++)
      collection[i].style.display = 'none'
      
    if(editPasscodeInput){
      editPasscodeInput.style.visibility = 'hidden'
    }
    doneButton.style.display = 'none'
    editButton.style.display = 'inline'
    editButton.innerHTML = "Edit List"
    submitEmailsButton.style.display = 'none'
  }

  function handleFinishedEditing() {
    //const editPasscodeInput = document.getElementById('editPasscodeInput')
    const editButton = document.getElementById('editButton')
    const doneButton = document.getElementById('doneButton')
    const collection = document.getElementsByClassName("editControls")
    //const logoutButton = document.getElementById('logoutButton')
    const submitEmailsButton = document.getElementById('submitEmailsButton')
    //hidden=true;
    for (let i = 0; i < collection.length; i++)
      collection[i].style.display = 'none'
      
    /*if(editPasscodeInput){
      editPasscodeInput.style.visibility = 'hidden'
    }*/
    doneButton.style.display = 'none'
    editButton.style.display = 'inline'
    editButton.innerHTML = "Edit List"
    //logoutButton.style.display = 'block'
    submitEmailsButton.style.display = 'block'
  }

  function checkPasscode(e) {
    const editButton = document.getElementById('editButton')
    if ((e.target.value) === SECRET) {
      // trigger click event on editButton when Enter key pressed
      e.target.addEventListener("keypress", (event) => {
        if (event.key === "Enter")
          editButton.click();
      });
    }
    setPasscode(e.target.value)
  }

  function abortPasscodeAttempt(e) {
    const editPasscodeInput = document.getElementById('editPasscodeInput')
    if (e !== SECRET) {
      setPasscode('')
      refPass.current.value = ''
      editPasscodeInput.style.visibility = 'hidden'
    }
  }



  if (hidden){
    //console.log(hidden);
    return (
    
      <div className="currentEntries posRel">
  
        <div className='userData'>
          
          <div className="editField editGui">
            <button id="editButton" onClick={login}>Log in</button>
            <input id="editPasscodeInput" ref={refPass} type="password"
              placeholder='Enter passcode' onChange={checkPasscode}
              onBlur={(e) => abortPasscodeAttempt(e.target.value)} />
          </div>
  
        </div>
      </div>
    )

  }
  else{
    //console.log(hidden);

    return (
    
    
    <div className="currentEntries posRel">
    <h2>Current Entries</h2>

      <div className='userData'>
        {entryList.map((val, k) => {
          return (<div key={k}>
            <div>{val.last_name}, {val.first_name}, {val.team} <span className="emailListed">{val.email_address}</span> </div>

            <div className="editControls editGui">
              <button className='delete' onClick={() => {

                deleteEntry(val.email_address)
              }}>delete</button>
              <button className='update' onClick={() => {
                if (newEmail.length > 0) {
                  updateEmail(val.email_address);
                }
              }}>update</button>
              <input type="email" className="updateInput" placeholder={val.email_address}
                onChange={(e) => setNewEmail(e.target.value)} />
            </div>
          </div>)

        })}
        
        <div className="editField editGui">
          <button id="editButton" onClick={handleEditList}>Edit List</button>
          <button id="doneButton" onClick={handleFinishedEditing}>Finished Editing</button>
        
        </div>
        <button id="submitEmailsButton" className='submitBtn' onClick={() => alert('TODO: Send It!')}>Email Vouchers</button>
        <button id="logoutButton" className='adminBtn' onClick={logout}>Log out</button>

      </div>
      <hr />
      <Tickets />
    </div>
    )
  }
  
}

export default CurrentEntries;