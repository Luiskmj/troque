export default function auth() {
  const token = localStorage.getItem('token');

  if (!token) {
    document.querySelector('body').className = '';
    return false;
  }
  document.querySelector('body').className = 'logged-in';
  return true;
}
