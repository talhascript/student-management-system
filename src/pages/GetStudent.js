// import {useState} from "react";
// import {Link} from "react-router-dom";
// import OutputContainer from "../components/OutputContainer";
// import {GetCall} from "../api/ApiCalls";

// function GetStudent() {
//     const [output, setOutput] = useState({nic: "", name: "", address: "", contact: ""});
//     const [nic, setNic] = useState("");
//     const [errMessage, setErrMessage] = useState("");
//     const [responseMessage, setResponseMessage] = useState("");

//     function handleChange(event) {
//         setOutput({nic: "", name: "", address: "", contact: ""});
//         setResponseMessage("");
//         setErrMessage("");
//         const newNic = event.target.value;
//         setNic(newNic);
//     }

//     async function handleSubmit(event) {
//         event.preventDefault();
//         setErrMessage("");
//         setResponseMessage("");
//         if (!/^\d{9}[Vv]$/.test(nic)) {
//             setErrMessage("Student nic number is empty or invalid");
//             document.getElementById("nic").focus();
//             return;
//         }
//         try {
//             const response = await GetCall(nic);
//             setResponseMessage("Student successfully get from the database");
//             setOutput({
//                 nic: response.data.nic,
//                 name: response.data.name,
//                 address: response.data.address,
//                 contact: response.data.contact
//             });
//         }
//         catch (err) {
//             if (err.response) {
//                 setResponseMessage(err.response.data.message);
//             } else {
//                 setResponseMessage(`Error: ${err.message}`);
//             }
//         }
//         finally {
//             setNic("");
//         }
//     }

//     return (
//         <div className={"centered-element"}>
//             <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"100px"} alt={"student-logo"}/>
//             <div className="student-container">
//                 <h1>Get Student Details</h1>
//                 <br/>
//                 <form onSubmit={handleSubmit}>
//                     <input onChange={handleChange} value={nic} id="nic" name="nic" placeholder="Enter NIC Number"/>
//                     <h5>{errMessage}&nbsp;</h5>
//                     <br/>
//                     <button type={"submit"}>Get Student Details</button>
//                     <Link className={"back-link"} to='/dashboard'>Back</Link>
//                 </form>
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

// export default GetStudent; // ORIGINAL CODE

import { useState } from "react";
import { Link } from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import { GetCall } from "../api/ApiCalls";

// Student class for encapsulating student data and validation logic
class Student {
    constructor(nic = "", name = "", address = "", contact = "") {
        this.nic = nic;
        this.name = name;
        this.address = address;
        this.contact = contact;
    }

    isNicValid() {
        return /^\d{9}[Vv]$/.test(this.nic);
    }
}

// Custom hook for handling form state and validation
function useStudentForm(initialState) {
    const [nic, setNic] = useState(initialState);
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    function handleChange(event) {
        const newNic = event.target.value;
        setNic(newNic);
        setErrMessage("");
        setResponseMessage("");
    }

    function validateNic() {
        const student = new Student(nic);
        if (!student.isNicValid()) {
            setErrMessage("Student nic number is empty or invalid");
            document.getElementById("nic").focus();
            return false;
        }
        return true;
    }

    return {
        nic,
        errMessage,
        responseMessage,
        setErrMessage,
        setResponseMessage,
        handleChange,
        validateNic,
    };
}

function GetStudent() {
    const {
        nic,
        errMessage,
        responseMessage,
        setErrMessage,
        setResponseMessage,
        handleChange,
        validateNic,
    } = useStudentForm("");
    const [output, setOutput] = useState(new Student());

    async function handleSubmit(event) {
        event.preventDefault();
        setErrMessage("");
        setResponseMessage("");
        if (!validateNic()) {
            return;
        }
        try {
            const response = await GetCall(nic);
            setResponseMessage("Student successfully retrieved from the database");
            setOutput({
                nic: response.data.nic,
                name: response.data.name,
                address: response.data.address,
                contact: response.data.contact
            });
        }
        catch (err) {
            setResponseMessage(err.response ? err.response.data.message : `Error: ${err.message}`);
        }
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"100px"} alt={"student-logo"} />
            <div className="student-container">
                <h1>Get Student Details</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={nic} id="nic" name="nic" placeholder="Enter NIC Number" />
                    <h5>{errMessage}&nbsp;</h5>
                    <br />
                    <button type={"submit"}>Get Student Details</button>
                    <Link className={"back-link"} to='/dashboard'>Back</Link>
                </form>
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

export default GetStudent; // REFACTORED CODE
