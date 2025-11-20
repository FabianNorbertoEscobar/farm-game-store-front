export default function ItemListContainer(props) {
    const { title } = props;

    const styles = {
        section: {
            marginTop: "24px",
            padding: "8px 0",
        },
        title: {
            fontSize: "28px",
        }
    };

    return (
        <section style={styles.section}>
            <h2 style={styles.title}>{title}</h2>
        </section>
    );
}
