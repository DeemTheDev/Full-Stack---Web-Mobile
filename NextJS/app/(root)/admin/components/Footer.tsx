import React from "react";

const Footer = () => {
  return (
    <footer className="sticky bottom-0 footer footer-center bg-base-300 text-base-content p-4 ">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by Ziaee
          Technologies Pty Ltd
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
