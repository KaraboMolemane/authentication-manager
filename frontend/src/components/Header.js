import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header({
  getAllUsers
}) {
  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);
  const username = searchParams.get("username");
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");
  const role = searchParams.get("role");

  function logOut() {
    fetch("/logout")
      .then((res) => res.json())
      .then(
        (result) => {
          toast(result.msg);
          //Route to homepage after logging out
          window.location.href = "/";
        },
        (error) => {
          toast(error.msg);
        }
      );
  }

  return (
    <div className="bd-example">
      <nav id="navbar-example2" className="navbar bg-light px-3">
        <a className="navbar-brand" href="#">
          Department Repo
        </a>
        <ul className="nav nav-pills">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-expanded="false"
            >
              {username}
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li className="dropdown-header">
                <h6>{firstname + " " + lastname}</h6>
                <span>{"Role: " + role}</span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a
                  className="dropdown-item d-flex align-items-center disabled"
                  href="users-profile.html"
                >
                  <i className="bi bi-person"></i>
                  <span>My Profile</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a
                  className="dropdown-item d-flex align-items-center disabled"
                  href="users-profile.html"
                >
                  <i className="bi bi-gear"></i>
                  <span>Account Settings</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a
                  className={(role === "admin")? "dropdown-item d-flex align-items-center" : "dropdown-item d-flex align-items-center disabled"}
                  href="pages-faq.html"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdropLive"
                  onClick={getAllUsers}
                >
                  <span>Edit user roles</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a
                  className={(role === "admin")? "dropdown-item d-flex align-items-center" : "dropdown-item d-flex align-items-center disabled"}
                  href="pages-faq.html"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdropLive2"
                  onClick={getAllUsers}
                >
                  <span>Reassign users</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center disabled"
                  href="pages-faq.html"
                >
                  <i className="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="#"
                  onClick={() => logOut()}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      {/* toaster */}
      <ToastContainer />
    </div>
  );
}

export default Header;
