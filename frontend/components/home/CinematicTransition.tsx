export default function CinematicTransition() {
  return (
    <section
      className="relative flex items-center justify-center bg-black"
      style={{ height: '100vh' }}
    >
      <h2
        className="text-center px-8 md:px-12 text-white"
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: 'bold',
          fontSize: 'clamp(2rem, 5vw, 4.5rem)',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
        }}
      >
        FOR THOSE
        <br />
        WHO TRAVEL
        <br />
        DIFFERENTLY
      </h2>
    </section>
  )
}
