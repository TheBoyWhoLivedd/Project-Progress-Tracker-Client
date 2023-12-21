import { Link } from "react-router-dom";

const Public = () => {
  return (
    <section className="flex flex-col gap-4 p-4 min-h-screen">
      <header>
        <h1 className="text-xl font-bold">
          Welcome to <span className="whitespace-nowrap">Mukisa Repairs!</span>
        </h1>
      </header>
      <main className="flex-grow border-t-2 border-b-2 border-border pt-4 pb-4">
        <p>
          Situated in the heart of Kampala City, Mukisa Repairs offers expert
          tech repair services with a team of skilled technicians.
        </p>
        <address className="mt-4 not-italic">
          Mukisa Repairs
          <br />
          Plot 10 Kampala Road
          <br />
          Kampala, Uganda
          <br />
          <a href="tel:+256700123456">+256 700 123456</a>
        </address>
        <br />
        <p>Owner: Joseph Mukisa</p>
      </main>
      <footer>
        <Link
          to="/login"
          // className="text-primary hover:text-primary-foreground"
        >
          Employee Login
        </Link>
      </footer>
    </section>
  );
};

export default Public;
