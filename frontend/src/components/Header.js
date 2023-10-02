import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  function logOut() {
    fetch("/logout")
      .then((res) => res.json())
      .then(
        (result) => {
          // setIsLoaded(true);
          // setItems(result);
          toast(result.msg);
          //Route to homepage
          window.location.href = "/";
        },
        (error) => {
          // setIsLoaded(true);
          // setError(error);
        }
      );
  }

  return (
    <div class="bd-example">
      <nav id="navbar-example2" class="navbar bg-light px-3">
        <a class="navbar-brand" href="#">
          Department Repo
        </a>
        <ul class="nav nav-pills">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-expanded="false"
            >
              User
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li class="dropdown-header">
                <h6>Kevin Anderson</h6>
                <span>Web Designer</span>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li>
                <a
                  class="dropdown-item d-flex align-items-center disabled"
                  href="users-profile.html"
                >
                  <i class="bi bi-person"></i>
                  <span>My Profile</span>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li>
                <a
                  class="dropdown-item d-flex align-items-center disabled"
                  href="users-profile.html"
                >
                  <i class="bi bi-gear"></i>
                  <span>Account Settings</span>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li>
                <a
                  class="dropdown-item d-flex align-items-center disabled"
                  href="pages-faq.html"
                >
                  <i class="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li>
                <a
                  class="dropdown-item d-flex align-items-center"
                  href="#"
                  onClick={() => logOut()}
                >
                  <i class="bi bi-box-arrow-right"></i>
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
