import React from 'react';
import { Link } from 'react-router-dom'
const PrivacyPolicy = () => {
    return (
        <>
            <article>
                <header>Kto jest administratorem danych?</header>
                <section>
                    <p>Administratorem danych jest Oriesst.com</p>
                </section>
            </article>
            <article>
                <header>Jakie dane gromadzimy i jak je wykorzystujemy?</header>
                <section>
                    <p><span>nazwa użytkownika i hasło</span> - zarejestrowanie użytkownika i umożliwienie użytkownikowi zalogowania się</p>
                    <br/>
                    <p><span>email</span> - wysłanie emaila, który umożliwia zresetowanie hasła</p>
                    <br/>
                    <p><span>płeć</span> - znalezienie odpowiedniej historyjki dla użytkownika</p>
                    <br/>
                    <p><span>wiadomości</span> - w przypadku zgłoszenia użytkownika sprawdzenie jego wiadomości pozwoli nam na stwierdzenie, czy użytkownik złamał regulamin.</p>
                    <br/>
                    <p>
                    <span>pliki cookie</span> - to, jak wykorzystujemy pliki cookie możesz sprawdzić w <Link to='/info/page/cookies'>polityka plików cookie</Link>
                    </p>
                    <br/>
                    <p><span>historyjki i postacie</span></p>
                </section>
            </article>
            <article>
                <header>Komu udostępniamy te informacje?</header>
                <section>
                    <p><span>nazwa użytkownik</span> - jest pokazywana użytkowinkom z którymi piszesz historyjkę</p>
                    <br/>
                    <p><span>historyjka</span> - mogą zobaczyć osoby, które dołączą do historyjki lub szukają historyjki</p>
                    <br/>
                    <p><span>postacie</span> - mogą zobaczyć osoby, które dołączają do historyjki do, której postacie zostały dodane</p>
                    <br/>
                    <p><span>wiadomości</span> - mogą zobaczyć osoby, które piszą historyjkę razem z tobą</p>
                </section>
            </article>
            <article>
                <header>Jak długo dane bedą przetwarzane?</header>
                <section>
                    <p>Dane będą przetwarzane do momentu gdy użytkownik usunie swoje konto</p>
                </section>
            </article>
            <article>
                <header>Prawa użytkownika</header>
                <section>
                    <p>Każdemu użytkownikowi, którego dane są przetwarzane przysługuje prawo do uzyskania dostępu, usunięcia, lub edytowania swoich danych.</p>
                    <br/>
                    <p>W celu realizacji uprawnień należy wysłać nam wiadomość na adres email support@oriesst.com </p>
                </section>
            </article>
            <article>
                <header>Zmiana polityki prywatności</header>
                <section>
                    <p>O wszelkich zmianach w polityce prywatności będziemy Cię informować.</p>
                </section>
            </article>
        </>
    )
}

export default PrivacyPolicy;