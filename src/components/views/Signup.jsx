import Navbar from "../organisms/Navbar";

const Signup = () => {
    return(
        <div>
            <Navbar routes={[{name: "Login", path: "/login"}]}/>
            <p>Signup page</p>
        </div>
    )
}

export default Signup;