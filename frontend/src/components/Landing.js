function Landing() {
  function handleSubmit(e) {}

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
                  <label for="username" className="form-label">
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
                  <label for="password" className="form-label">
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
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalFullscreen"
                  onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </button>
              </form>
              {/* Register Modal  */}
              <div
                class="modal fade"
                id="staticBackdropLive"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabindex="-1"
                aria-labelledby="staticBackdropLiveLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="staticBackdropLiveLabel">
                        Register: credentials repoitory
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div>
                        <div class="bd-example-snippet bd-code-snippet">
                          <div class="bd-example">
                            <form class="row g-3">
                              <div class="col-md-6">
                                <label for="firstName" class="form-label">
                                  First name
                                </label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="firstName"
                                  required=""
                                />
                              </div>
                              <div class="col-md-6">
                                <label for="lastName" class="form-label">
                                  Last name
                                </label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="lastName"
                                  required=""
                                />
                              </div>
                              <div class="col-md-6">
                                <label for="userName" class="form-label">
                                  Username
                                </label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="userName"
                                  required=""
                                />
                              </div>
                              <div class="col-md-6">
                                <label for="password" class="form-label">
                                  Password
                                </label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="password"
                                  required=""
                                />
                              </div>
                              <div class="col-12">
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
                    <div class="modal-footer">
                      <button
                        class="btn btn-primary"
                        type="submit"
                        data-bs-dismiss="modal"
                      >
                        Register
                      </button>
                      <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
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
    </>
  );
}

export default Landing;
