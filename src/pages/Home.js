import {Link} from "react-router-dom";

function Home() {
    return (
        <div className={"centered-element"}>
            <div className={"student-container"}>
                <h1>THE Student Management System Dashboard</h1>
                <br/><br/>
                <img src={"./images/dashboard-logo.png"} width={"400px"} alt={"dashboard-logo"}/>
                <br/><br/>
                <Link className={"back-link"} to='/dashboard/submit'>Submit Student</Link>
                <Link className={"back-link"} to='/dashboard/get'>Get Student Details</Link>
                <Link className={"back-link"} to='/dashboard/update'>Update Student Details</Link>
                <Link className={"back-link"} to='/dashboard/delete'>Delete Student</Link>
                <Link className={"back-link"} to='/'>Log Out</Link>
            </div>
        </div>
    );
}

export default Home;