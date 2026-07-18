export function setLoading(isLoading) {
  const loader = document.getElementById("loader");

  if (!loader) return;

  loader.classList.toggle(
    "hidden",
    !isLoading
  );
}