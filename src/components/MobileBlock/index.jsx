import styles from './MobileBlock.module.css';

const ASCII_ART = `
  _   _  ___  ____  _   _ ___  ____  ___  ____  ___
 | \\ | |/ _ \\|  _ \\| \\ | |_ _|  _ \\|_ _|/ __ \\|_ _|
 |  \\| | | | | | | |  \\| || || | | || || |  | || |
 | |\\  | |_| | |_| | |\\  || || |_| || || |__| || |
 |_| \\_|\\___/|____/|_| \\_|___|____/|___| \\____/|___|
`;

export function MobileBlock() {
  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <pre className={styles.ascii}>{ASCII_ART}</pre>

        <div className={styles.errorBox}>
          <div className={styles.errorHeader}>
            <span className={styles.errorIcon}>⚠️</span>
            <span className={styles.errorTitle}>PANTALLA DEMASIADO PEQUEÑA</span>
          </div>
          <div className={styles.errorBody}>
            <p>Este sistema operativo requiere una pantalla de escritorio.</p>
            <p>&nbsp;</p>
            <p>Resolución mínima: <strong>768px de ancho</strong></p>
            <p>&nbsp;</p>
            <p>Por favor accede desde un ordenador o aumenta el tamaño de la ventana del navegador.</p>
            <p>&nbsp;</p>
            <p className={styles.sarcasm}>
              (Los portafolios retro de Windows 97 no se diseñaron para pantallas de 6 pulgadas. <em>Todavía.</em>)
            </p>
            <p>&nbsp;</p>
            <p className={styles.pressKey}>Presiona F1 para continuar...</p>
            <p className={styles.pressKeyHint}>(No hay F1 en los móviles)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
