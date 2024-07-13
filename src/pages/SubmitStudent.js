// import {useState} from "react";
// import {Link} from "react-router-dom";
// import OutputContainer from "../components/OutputContainer";
// import {PostCall} from "../api/ApiCalls";

// function SubmitStudent() {
//     const [output, setOutput] = useState({nic: "", name: "", address: "", contact: ""});
//     const [student, setStudent] = useState({nic: "", name: "", address: "", contact: ""});
//     const [errMessage, setErrMessage] = useState("");
//     const [responseMessage, setResponseMessage] = useState("");

//     function handleChange(event) {
//         const {name, value} = event.target;
//         setResponseMessage("");
//         setErrMessage("");
//         setStudent((prevValue) => {
//             return {
//                 ...prevValue,
//                 [name]: value
//             }
//         });
//     }

//     function handleCheckOut() {
//         setErrMessage("");
//         setResponseMessage("");
//         if (!/^\d{9}[Vv]$/.test(student.nic)) {
//             setErrMessage("Student nic number is empty or invalid");
//             document.getElementById("nic").focus();
//             return;
//         } else if (!/^[A-Za-z][A-Za-z ]+$/.test(student.name)) {
//             setErrMessage("Student name is empty or invalid");
//             document.getElementById("name").focus();
//             return;
//         } else if (!/^[A-Za-z\d][A-Za-z\d-|/# ,.:;\\]+$/.test(student.address)) {
//             setErrMessage("Student address is empty or invalid");
//             document.getElementById("address").focus();
//             return;
//         } else if (!/^\d{3}-\d{7}$/.test(student.contact)) {
//             setErrMessage("Student contact is empty or invalid");
//             document.getElementById("contact").focus();
//             return;
//         }
//         setOutput({nic: student.nic, name: student.name, address: student.address, contact: student.contact});
//         setStudent({nic: "", name: "", address: "", contact: ""});
//     }

//     async function handleSubmit(event) {
//         event.preventDefault();
//         setErrMessage("");
//         setResponseMessage("");
//         if (!output.nic || !output.name || !output.address || !output.contact) {
//             setErrMessage("Inputs didn't checked out");
//             return;
//         }
//         try {
//             await PostCall(output);
//             setResponseMessage("Student successfully submitted to the database");
//         }
//         catch (err) {
//             if (err.response) {
//                 setResponseMessage(err.response.data.message);
//             } else {
//                 setResponseMessage(`Error: ${err.message}`);
//             }
//         }
//         finally {
//             setOutput({nic: "", name: "", address: "", contact: ""});
//         }
//     }

//     return (
//         <div className={"centered-element"}>
//             <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"120px"} alt={"user-logo"}/>
//             <div className="student-container">
//                 <h1>Submit Student</h1>
//                 <br/>
//                 <form onSubmit={handleSubmit}>
//                     <input onChange={handleChange} value={student.nic} id="nic" name="nic" placeholder="Enter NIC Number" />
//                     <input onChange={handleChange} value={student.name} id="name" name="name" placeholder="Enter Name" />
//                     <input onChange={handleChange} value={student.address} id="address" name="address" placeholder="Enter Address" />
//                     <input onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Enter Contact" />
//                     <h5>{errMessage}&nbsp;</h5>
//                     <br/>
//                     <button onClick={handleCheckOut} type={"button"}>Check Out</button>
//                     <button type={"submit"}>Submit Student</button>
//                     <Link className={"back-link"} to='/dashboard'>Back</Link>
//                 </form>
//                 <br/>
//                 <OutputContainer
//                     nic={output.nic}
//                     name={output.name}
//                     address={output.address}
//                     contact={output.contact}
//                 />
//                 <br/>
//                 <h4>{responseMessage}</h4>
//             </div>
//         </div>
//     );
// }

// export default SubmitStudent;  // ORIGINAL CODE

import { useState } from "react";
import { Link } from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import { PostCall } from "../api/ApiCalls";

// Student class for encapsulating student data and validation logic
class Student {
    constructor(nic = "", name = "", address = "", contact = "") {
        this.nic = nic;
        this.name = name;
        this.address = address;
        this.contact = contact;
    }

    isValid() {
        return this.isNicValid() && this.isNameValid() && this.isAddressValid() && this.isContactValid();
    }

    isNicValid() {
        return /^\d{9}[Vv]$/.test(this.nic);
    }

    isNameValid() {
        return /^[A-Za-z][A-Za-z ]+$/.test(this.name);
    }

    isAddressValid() {
        return /^[A-Za-z\d][A-Za-z\d-|/# ,.:;\\]+$/.test(this.address);
    }

    isContactValid() {
        return /^\d{3}-\d{7}$/.test(this.contact);
    }
}

// Custom hook for handling form state and validation
function useStudentForm(initialState) {
    const [student, setStudent] = useState(initialState);
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;
        setResponseMessage("");
        setErrMessage("");
        setStudent((prevValue) => ({ ...prevValue, [name]: value }));
    }

    function validateStudent() {
        const newStudent = new Student(student.nic, student.name, student.address, student.contact);
        if (!newStudent.isNicValid()) {
            setErrMessage("Student nic number is empty or invalid");
            document.getElementById("nic").focus();
            return false;
        } else if (!newStudent.isNameValid()) {
            setErrMessage("Student name is empty or invalid");
            document.getElementById("name").focus();
            return false;
        } else if (!newStudent.isAddressValid()) {
            setErrMessage("Student address is empty or invalid");
            document.getElementById("address").focus();
            return false;
        } else if (!newStudent.isContactValid()) {
            setErrMessage("Student contact is empty or invalid");
            document.getElementById("contact").focus();
            return false;
        }
        return true;
    }

    function resetStudent() {
        setStudent(new Student());
    }

    return {
        student,
        errMessage,
        setErrMessage,
        responseMessage,
        setResponseMessage,
        handleChange,
        validateStudent,
        resetStudent,
    };
}

function SubmitStudent() {
    const {
        student,
        errMessage,
        setErrMessage,
        responseMessage,
        setResponseMessage,
        handleChange,
        validateStudent,
        resetStudent,
    } = useStudentForm(new Student());
    const [output, setOutput] = useState(new Student());

    function handleCheckOut() {
        if (validateStudent()) {
            setOutput({ ...student });
            resetStudent();
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!output.isValid()) {
            setErrMessage("Inputs didn't checked out");
            return;
        }
        try {
            await PostCall(output);
            setResponseMessage("Student successfully submitted to the database");
        } catch (err) {
            setResponseMessage(err.response ? err.response.data.message : `Error: ${err.message}`);
        } finally {
            setOutput(new Student());
        }
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"120px"} alt={"user-logo"} />
            <div className="student-container">
                <h1>Submit Student</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={student.nic} id="nic" name="nic" placeholder="Enter NIC Number" />
                    <input onChange={handleChange} value={student.name} id="name" name="name" placeholder="Enter Name" />
                    <input onChange={handleChange} value={student.address} id="address" name="address" placeholder="Enter Address" />
                    <input onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Enter Contact" />
                    <h5>{errMessage}&nbsp;</h5>
                    <br />
                    <button onClick={handleCheckOut} type={"button"}>Check Out</button>
                    <button type={"submit"}>Submit Student</button>
                    <Link className={"back-link"} to='/dashboard'>Back</Link>
                </form>
                <br />
                <OutputContainer
                    nic={output.nic}
                    name={output.name}
                    address={output.address}
                    contact={output.contact}
                />
                <br />
                <h4>{responseMessage}</h4>
            </div>
        </div>
    );
}

export default SubmitStudent; // REFACTORED CODE
