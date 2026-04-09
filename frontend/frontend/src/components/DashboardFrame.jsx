function DashboardFrame({ title, src }) {
  const handleLoad = (event) => {
    const frame = event.currentTarget;
    const doc = frame.contentDocument;

    if (!doc) {
      return;
    }

    const topElements = doc.querySelectorAll("body > header, body > nav");
    topElements.forEach((element) => {
      element.style.display = "none";
    });

    const main = doc.querySelector("main");
    if (main) {
      main.style.paddingTop = "0";
      main.style.marginTop = "0";
      main.style.height = "100vh";
    }
  };

  return (
    <section className="frame-shell" aria-label={title}>
      <iframe
        className="dashboard-frame"
        title={title}
        src={src}
        onLoad={handleLoad}
        loading="eager"
      />
    </section>
  );
}

export default DashboardFrame;
