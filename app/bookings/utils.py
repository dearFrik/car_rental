from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_booking_confirmation(booking):
    """
    Отправляет email пользователю о создании бронирования.
    """
    subject = f"Подтверждение бронирования #{booking.id}"
    context = {
        'booking': booking,
        'car': booking.car,
        'user': booking.user,
        'start_date': booking.start_date,
        'end_date': booking.end_date,
        'total_price': booking.total_price,
        'status': booking.get_status_display(),
    }
    
    # HTML-письмо (можно потом сделать красивый шаблон)
    html_message = render_to_string('bookings/email_booking_confirmation.html', context)
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [booking.user.email],
        html_message=html_message,
        fail_silently=False,
    )