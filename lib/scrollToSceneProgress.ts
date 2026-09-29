export function scrollToSceneProgress(sectionId: string, progress: number, behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const range = Math.max(0, el.offsetHeight - window.innerHeight);
  window.scrollTo({ top: top + range * progress, behavior });
}
