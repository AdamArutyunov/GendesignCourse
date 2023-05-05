import os
import time
import json

from dotenv import load_dotenv
from telegram import LabeledPrice, Bot
from telegram.ext import CommandHandler, MessageHandler, Updater, Dispatcher, PreCheckoutQueryHandler, Filters

from permissions import admin_required
from helpers import generate_exponential_interpolator

load_dotenv()

def get_current_price():
    from datetime import datetime
    import math

    template = '%Y-%m-%dT%H:%M:%S'

    start_date = datetime.strptime('2023-05-01T09:00:00', template)
    end_date = datetime.strptime('2023-05-15T14:00:00', template)

    start_days = 0
    end_days = (end_date - start_date).total_seconds() / 86400

    current_date = datetime.now()

    current_days = (current_date - start_date).total_seconds() / 86400

    start_price = 9500
    end_price = 16000
    
    generator = generate_exponential_interpolator(start_price, end_price, [start_days, end_days], 0.1)

    price = generator(current_days)

    return math.floor(price / 10) * 10


TOKEN = os.getenv('TOKEN')
PAYMENT_PROVIDER_TOKEN = os.getenv('PROVIDER_TOKEN')
PROMOCODE_PRICES = {
    'park_f8Ek39v1f': lambda: 10500,
    'test_nv82REg9a': lambda: 100,
    None: get_current_price,
}
LOG_CHAT_ID = -1001665135759
MODES = ['active', 'contact']

data = None

def save_data():
    with open('data.json', 'w') as f:
        json.dump(data, f)


def load_data():
    global data

    try:
        with open('data.json') as f:
            data = json.load(f)
    except Exception as f:
        data = {'mode': 'active', 'subscribers': [], 'success_link': 'https://t.me/adam_arutyunov'}
        save_data()


@admin_required
def set_data(update, context):
    ALLOWED_KEYS = ['success_link']

    args = context.args
    
    if not args or len(args) != 2:
        return update.message.reply_text('Синтаксис: /set <key> <value>')

    key, value = args

    if key not in ALLOWED_KEYS:
        return update.message.reply_text('Неверный ключ.')

    data[key] = value
    save_data()

    return update.message.reply_text(f'<b>{key}:</b> {data[key]}', parse_mode='HTML')


def start(update, context):
    subscribe(update, context)

    if data['mode'] == 'active':
        return send_invoice(update, context)

    elif data['mode'] == 'contact':
        return send_contact_prompt(update, context)


def send_contact_prompt(update, context):
    message = '''<b>Ой.</b>

Мест на этот поток нет, всё раскупили. В следующий раз обязательно позовём вас  п е р с о н а л ь н о!

А пока что приходите тусить <a href='https://t.me/gen_c'>в генклуб</a>! Ну, и на каналы <a href='https://t.me/ivandianov'>Ивана Дианова</a> и <a href='https://t.me/cdarr'>Адама Арутюнова</a> вы же подписались, да?'''

    update.message.reply_text(message, parse_mode='HTML')


def get_subscriber(chat_id):
    subscribers = list(filter(lambda u: u['chat_id'] == chat_id, data['subscribers']))

    if not subscribers:
        return None

    return subscribers[0]


def subscribe(update, context):
    chat_id = update.message.chat_id
    username = update.message.from_user.username

    subscriber = get_subscriber(chat_id)

    if not subscriber:
        data['subscribers'].append({'chat_id': chat_id, 'username': username})
        save_data()


@admin_required
def print_subscribers(update, context):
    subscribers = data['subscribers']

    out = '<b>Подписались на обновления:</b>\n\n'
    for subscriber in subscribers:
        out += f'@{subscriber["username"]}\n'

    out += f'\n<b>Всего подписчиков:</b> {len(subscribers)}.'

    update.message.reply_text(out, parse_mode='HTML')


@admin_required
def print_mailing(update, context):
    filename = context.args[0]

    try:
        with open(os.path.join(os.getcwd(), 'mailings/', filename)) as f:
            text = f.read()
            update.message.reply_text(text, parse_mode='HTML')

    except Exception as e:
        update.message.reply_text(f'Ошибка: {e}')


@admin_required
def send_mailing(update, context):
    filename = context.args[0]
    confirmation = context.args[1]
    subscribers = data['subscribers']

    if confirmation != 'y':
        return update.message.reply_text('No confirmation.')

    update.message.reply_text('Текст рассылки:')
    print_mailing(update, context)

    with open('mailings/' + filename) as f:
        text = f.read()

    update.message.reply_text('Начинаю рассылку.')

    for subscriber in subscribers:
        update.message.reply_text(f'Отправляю сообщение пользователю {subscriber["username"]} (ID диалога {subscriber["chat_id"]})')

        try:
            bot.send_message(chat_id=subscriber["chat_id"], text=text, parse_mode='HTML')
            update.message.reply_text('Сообщение отправлено.')
        except Exception as e:
            update.message.reply_text('Не удалось отправить сообщение: ' + str(e))

    update.message.reply_text('Рассылка завершена.')



def send_invoice(update, context):
    """Sends an invoice without shipping-payment."""
    args = context.args

    chat_id = update.message.chat_id
    title = "Курс генеративного дизайна"
    description = "Доступ к курсу генеративного дизайна https://course.genclub.club.\n\nПосле оплаты бот пришлёт ссылку на вступление в телеграм-чат. Если что-то пошло не так, напишите @adam_arutyunov.\n"
    photo_url = 'https://course.genclub.club/images/og.jpg?a=6'
    payload = "Gendesign-Course-Payload"

    currency = "RUB"
    
    if args and args[0] in PROMOCODE_PRICES:
        price = PROMOCODE_PRICES[args[0]]()
    else:
        price = PROMOCODE_PRICES[None]()

    print(price, flush=True)

    prices = [LabeledPrice("Заплатить", price * 100)]

    context.bot.send_invoice(
        chat_id, title, description, payload, PAYMENT_PROVIDER_TOKEN, currency, prices,
        'start', photo_url,
        need_email=True,
    )


def precheckout_callback(update, context):
    """Answers the PreCheckoutQuery"""

    query = update.pre_checkout_query

    if data['mode'] != 'active' or query.invoice_payload != "Gendesign-Course-Payload":
        query.answer(ok=False, error_message="Something went wrong...")
    else:
        query.answer(ok=True)


def successful_payment_callback(update, context):
    """Confirms the successful payment."""
    update.message.reply_text("Спасибо за покупку!\n\nСсылка на чат: " + data['success_link'])

    payment = update.message.successful_payment
    user = update.message.from_user.username

    message = '<b>🎉 Новый платёж!</b>\n\n'
    message += f'Сумма: {payment.total_amount // 100} {payment.currency}\n'
    message += f'Пользователь: @{user}\n'
    message += f'Почта: {payment.order_info.email}\n'
    message += f'ID транзакции в ЮКассе: {payment.provider_payment_charge_id}'

    bot.send_message(chat_id=LOG_CHAT_ID, text=message, parse_mode='HTML')


@admin_required
def change_mode(update, context):
    args = context.args
    if not args or not args[0] or args[0] not in MODES:
        return update.message.reply_text('Доступные режимы: ' + ', '.join(MODES) + '.')

    data['mode'] = args[0]
    save_data()

    update.message.reply_text('Режим бота изменён на ' + args[0] + '.')


if __name__ == '__main__':
    load_data()

    bot = Bot(token=TOKEN)

    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher

    print('Bot initialized.')

    dp.add_handler(CommandHandler("start", start, pass_args=True))
    dp.add_handler(CommandHandler("shutupandtakemymoney", start, pass_args=True))
    dp.add_handler(CommandHandler("mode", change_mode, pass_args=True))
    dp.add_handler(CommandHandler("sub", subscribe))
    dp.add_handler(CommandHandler("subscribers", print_subscribers))

    dp.add_handler(CommandHandler("print", print_mailing, pass_args=True))
    dp.add_handler(CommandHandler("send", send_mailing, pass_args=True))
    dp.add_handler(CommandHandler("set", set_data, pass_args=True))

    dp.add_handler(PreCheckoutQueryHandler(precheckout_callback))

    dp.add_handler(
        MessageHandler(Filters.successful_payment, successful_payment_callback)
    )

    
    print('Starting bot...')

    updater.start_polling()

