import Image from "next/image";
import styles from "./page.module.css";
import WeatherDataWidget from "./components/weatherWidget/weatherWidget";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.headingWrap}>
        <h1>Data Display Web App</h1>
      </div>
      <WeatherDataWidget />
    </main>
  );
}
