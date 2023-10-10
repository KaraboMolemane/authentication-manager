import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Landing() {
  function handleSignIn(e) {
    e.preventDefault();
    const credentials = {
      username: document.getElementById("floatingUsername").value,
      password: document.getElementById("floatingPassword").value,
    };

    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((res) => {
        toast(res.message);
        if (res.message !== "Incorrect login!") {
          // redirect for successful login
          // window.location.href = "/repo?login="+res.token;
          window.location.href =
            "/repo?username=" +
            res.username +
            "&firstname=" +
            res.firstname +
            "&lastname=" +
            res.lastname +
            "&role=" +
            res.role;
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
      <div
        class="modal modal-sheet position-static d-block bg-body-secondary p-4 py-md-5"
        tabindex="-1"
        role="dialog"
        id="modalSignin"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content rounded-4 shadow">
            <div class="modal-header p-5 pb-4 border-bottom-0">
              <h1 class="fw-bold mb-0 fs-2">CoolTech: credential repo</h1>
            </div>

            <div class="modal-body p-5 pt-0">
              <form class="">
                <div class="form-floating mb-3">
                  <input
                    type="text"
                    class="form-control rounded-3"
                    id="floatingUsername"
                    placeholder="name@example.com"
                  />
                  <label for="floatingUsername">Username</label>
                </div>
                <div class="form-floating mb-3">
                  <input
                    type="password"
                    class="form-control rounded-3"
                    id="floatingPassword"
                    placeholder="Password"
                  />
                  <label for="floatingPassword">Password</label>
                </div>
                <button
                  class="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
                  type="submit"
                  onClick={(e) => handleSignIn(e)}
                >
                  Sign in
                </button>
                <small class="text-body-secondary">
                  By clicking Sign in, you agree to the terms of use.
                </small>
                <hr class="my-4" />
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
              </form>
            </div>
          </div>
        </div>
      </div>
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
              <h1 className="modal-title fs-5" id="staticBackdropLiveLabel">
                Register: credentials repository
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
                        <label htmlFor="firstName" className="form-label">
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
                        <label htmlFor="lastName" className="form-label">
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
                        <label htmlFor="username" className="form-label">
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
                        <label htmlFor="password" className="form-label">
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
                          You will be redirected to the Sign-In page after
                          registering.
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
      <div>
        {/* toaster */}
        <ToastContainer />
      </div>
    </>
  );
}

export default Landing;
