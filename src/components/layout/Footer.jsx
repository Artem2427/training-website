function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-2 mt-auto">
      <div className="container-fluid px-4 text-center">
        <p className="mb-0">&copy; {currentYear} Сайт про гепардів</p>
      </div>
    </footer>
  );
}

export default Footer;