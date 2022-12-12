import { useState, useRef } from 'react';
import axios from 'axios'



const AddEntry = () => {


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [team, setTeam] = useState('');

  const [entryList, setEntryList] = useState([])

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);


  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  // CREATE (POST)
  function submitEntry() {
    axios.post(`${process.env.REACT_APP_HOST}/api/create`, { first: firstName, last: lastName, email: emailAddress, team:team }).then((response) => {
      setEntryList([...entryList, { first_name: firstName, last_name: lastName, email_address: emailAddress , team:team}]
      )
    })
    ref1.current.value = ""
    setFirstName('')
    ref2.current.value = ""
    setLastName('')
    ref3.current.value = ""
    setEmailAddress('')
    ref4.current.value = ""
    setTeam('')
    console.log(team)
    //alert("Successfully added")
    if (validateEmail(emailAddress)) {
      console.log(document.getElementsByClassName("submitBtn")[0])
      document.getElementsByClassName("submitBtn")[0].innerHTML = "Success!";
      document.getElementsByClassName("submitBtn")[0].style.backgroundColor = "green";
    }
    else{
      alert('No valid email')
    }
  }

  function refreshPage() {
    //window.location.reload(false);
  }
  
  
  // Reset Button Color
  let ifname = document.getElementById('firstName');
  if (ifname) {
    ifname.addEventListener('click', function () {
      document.getElementsByClassName("submitBtn")[0].innerHTML = "Add Entry";
      document.getElementsByClassName("submitBtn")[0].style.backgroundColor = "white";
    })
  }

  let ilname = document.getElementById('lastName');
  if (ilname) {
    ilname.addEventListener('click', function () {
      document.getElementsByClassName("submitBtn")[0].innerHTML = "Add Entry";
      document.getElementsByClassName("submitBtn")[0].style.backgroundColor = "white";
    })
  }

  let iemail = document.getElementById('email');
  if (iemail) {
    iemail.addEventListener('click', function () {
      document.getElementsByClassName("submitBtn")[0].innerHTML = "Add Entry";
      document.getElementsByClassName("submitBtn")[0].style.backgroundColor = "white";
    })
  }
  
  let iteam = document.getElementById('team');
  if (iteam) {
    iteam.addEventListener('click', function () {
      document.getElementsByClassName("submitBtn")[0].innerHTML = "Add Entry";
      document.getElementsByClassName("submitBtn")[0].style.backgroundColor = "white";
    })
  }

  return (
    <div className="addEntry">
      <h2>Add an Entry</h2>
      <div id='userInput'>
        <div>
          <label htmlFor="firstName" >First Name*</label>
          <input ref={ref1} id="firstName" type="text" name="firstName" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name*</label>
          <input ref={ref2} id="lastName" type="text" name="lastName" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="emailField" >
          <label htmlFor="email">Email Address*</label>
          <input ref={ref3} id="email" type="email" name="email" placeholder="Email Address" onChange={(e) => setEmailAddress(e.target.value)} />
        </div>
        <div>
          <label htmlFor="team" >Team</label>
          <input ref={ref4} id="team" type="text" name="team" placeholder="Team Name" onChange={(e) => setTeam(e.target.value)}
          />
        </div>
        <button className="submitBtn"
          onClick={() => {
            if (firstName.length > 0 && lastName.length > 0 && emailAddress.length > 0) {
              submitEntry(); refreshPage();
            }
          }
        }
        >Add Entry </button>
      </div>
    </div>
  )
}

export default AddEntry;