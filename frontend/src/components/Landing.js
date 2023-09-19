import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Landing() {
  
  function handleSignIn(e) {
    e.preventDefault();
    const credentials = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };

    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((res) => {
        toast(res.message);         
        if(res.token){
          // redirect for successful login
          window.location.href = "/repos";
        }        
      });
  }

  function handleRegister(e) {
    // ADD a new user
    e.preventDefault();
    const user = {
      firstname: document.getElementById("firstnameReg").value,
      lastname: document.getElementById("lastnameReg").value,
      username: document.getElementById("usernameReg").value,
      password: document.getElementById("passwordReg").value,
    };

    clearModalOnClose();

    fetch("/user-add-new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })      
    .then((res) => res.json())
    .then((res) => {
      toast(res.message);      
    });
  }

  function clearModalOnClose() {
    document.getElementById("firstnameReg").value = "";
    document.getElementById("lastnameReg").value = "";
    document.getElementById("usernameReg").value = "";
    document.getElementById("passwordReg").value = "";
  }

  return (
    <>

      <div className="row">
        <div className="col-3"></div>
        <div className="col-6">
          <div className="container my-5">
            <div className="p-5 text-center bg-body-tertiary rounded-3">
              <br />
              <h1 className="text-body-emphasis">Cool Tech credential repo</h1>
              <h4 className="text-body-emphasis">Sign In</h4>
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                  />
                </div>
                <div id="emailHelp" className="form-text mb-3">
                  Are you a new employee? Click{" "}
                  <span
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdropLive"
                    style={{
                      textDecoration: "underline",
                      color: "blue",
                      cursor: "pointer",
                    }}
                  >
                    here
                  </span>
                  &nbsp;to register.
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={(e) => handleSignIn(e)}
                >
                  Submit
                </button>
              </form>
              {/* Register Modal  */}
              <div
                className="modal fade"
                id="staticBackdropLive"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabndex="-1"
                aria-labelledby="staticBackdropLiveLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1
                        className="modal-title fs-5"
                        id="staticBackdropLiveLabel"
                      >
                        Register: credentials repoitory
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div>
                        <div className="bd-example-snippet bd-code-snippet">
                          <div className="bd-example">
                            <form className="row g-3">
                              <div className="col-md-6">
                                <label
                                  htmlFor="firstName"
                                  className="form-label"
                                >
                                  First name
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="firstnameReg"
                                  required=""
                                />
                              </div>
                              <div className="col-md-6">
                                <label
                                  htmlFor="lastName"
                                  className="form-label"
                                >
                                  Last name
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="lastnameReg"
                                  required=""
                                />
                              </div>
                              <div className="col-md-6">
                                <label
                                  htmlFor="username"
                                  className="form-label"
                                >
                                  Username
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="usernameReg"
                                  required=""
                                />
                              </div>
                              <div className="col-md-6">
                                <label
                                  htmlFor="password"
                                  className="form-label"
                                >
                                  Password
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="passwordReg"
                                  required=""
                                />
                              </div>
                              <div className="col-12">
                                <div id="emailHelp" className="form-text mb-3">
                                  You will be redirected to the Sign-In page
                                  after registering.
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-primary"
                        type="button"
                        data-bs-dismiss="modal"
                        onClick={(e) => handleRegister(e)}
                      >
                        Register
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={(e) => clearModalOnClose(e)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* toaster */}
        <ToastContainer />
      </div>
    </>
  );
}

export default Landing;
