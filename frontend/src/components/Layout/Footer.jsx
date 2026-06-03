import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-text">
          © {new Date().getFullYear()} <span className="gradient-text">BlogFlow</span> — Built with MERN Stack
        </p>
        <p className="footer-sub">Full Stack Development Internship — Navyan</p>
      </div>
    </footer>
  );
};

export default Footer;
