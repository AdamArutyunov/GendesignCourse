import os
import time
import json

from dotenv import load_dotenv
from telegram import LabeledPrice, Bot
from telegram.ext import CommandHandler, MessageHandler, Updater, Dispatcher, PreCheckoutQueryHandler, Filters


load_dotenv()

TOKEN = os.getenv('TOKEN')
PAYMENT_PROVIDER_TOKEN = os.getenv('PROVIDER_TOKEN')
PROMOCODE_PRICES = {
    'park_f8Ek39v1f': 5500,
    'test_nv82REg9a': 100,
    None: 7500,
}
LOG_CHAT_ID = -1001665135759
SUCCESS_LINK = 'https://t.me/+PsBgiiSkBuJhMGUy'
ADMINS = [115178271, 227496872]
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
        data = {'mode': 'active', 'subscribers': []}
        save_data()


def start(update, context):
    if data['mode'] == 'active':
        return send_invoice(update, context)

    elif data['mode'] == 'contact':
        return send_contact_prompt(update, context)


def send_contact_prompt(update, context):
    message = '''<b>Ой.</b>

Мест на этот поток нет, всё раскупили. Чтобы в следующий раз мы позвали вас  п е р с о н а л ь н о, нажмите /sub. Можно будет отменить подписку на уведомления с помощью /unsub.

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

    if subscriber:
        update.message.reply_text('Вы уже подписаны на обновления. Обязательно напишем, когда начнётся новый поток. Отписаться можно через /unsub.')
    else:
        data['subscribers'].append({'chat_id': chat_id, 'username': username})
        save_data()

        update.message.reply_text('Теперь вы подписаны на обновления. Обязательно напишем, когда начнётся новый поток. Отписаться можно через /unsub.')


def unsubscribe(update, context):
    chat_id = update.message.chat_id
    subscriber = get_subscriber(chat_id)

    if subscriber:
        data['subscribers'].remove(subscriber)
        save_data()

        update.message.reply_text('Отписали вас от обновлений о новых наборах на курс. Подписаться обратно можно через /sub.')
    else:
        update.message.reply_text('Вы не подписаны на обновления о новых наборах на курс. Подписаться можно через /sub.')


def print_subscribers(update, context):
    if update.message.chat_id not in ADMINS:
        return update.message.reply_text('Подписчиков могут увидеть только администраторы.')


    subscribers = data['subscribers']

    out = '<b>Подписались на обновления:</b>\n\n'
    for subscriber in subscribers:
        out += f'@{subscriber["username"]}\n'

    update.message.reply_text(out, parse_mode='HTML')


def send_invoice(update, context):
    """Sends an invoice without shipping-payment."""
    args = context.args

    chat_id = update.message.chat_id
    title = "Курс генеративного дизайна"
    description = "Доступ к курсу генеративного дизайна https://course.genclub.club.\n\nПосле оплаты бот пришлёт ссылку на вступление в телеграм-чат. Если что-то пошло не так, напишите @adam_arutyunov.\n"
    photo_url = 'https://course.genclub.club/images/og.jpg'
    payload = "Gendesign-Course-Payload"

    currency = "RUB"
    
    if args and args[0] in PROMOCODE_PRICES:
        price = PROMOCODE_PRICES[args[0]]
    else:
        price = PROMOCODE_PRICES[None]

    prices = [LabeledPrice("Заплатить", price * 100)]

    context.bot.send_invoice(
        chat_id, title, description, payload, PAYMENT_PROVIDER_TOKEN, currency, prices,
        'start', photo_url,
        need_email=True,
    )


def precheckout_callback(update, context):
    """Answers the PreCheckoutQuery"""

    query = update.pre_checkout_query

    if query.invoice_payload != "Gendesign-Course-Payload":
        query.answer(ok=False, error_message="Something went wrong...")
    else:
        query.answer(ok=True)


def successful_payment_callback(update, context):
    """Confirms the successful payment."""
    update.message.reply_text("Спасибо за покупку!\n\nСсылка на чат: " + SUCCESS_LINK)

    payment = update.message.successful_payment
    user = update.message.from_user.username

    message = '<b>🎉 Новый платёж!</b>\n\n'
    message += f'Сумма: {payment.total_amount // 100} {payment.currency}\n'
    message += f'Пользователь: @{user}\n'
    message += f'Почта: {payment.order_info.email}\n'
    message += f'ID транзакции в ЮКассе: {payment.provider_payment_charge_id}'

    bot.send_message(chat_id=LOG_CHAT_ID, text=message, parse_mode='HTML')


def change_mode(update, context):
    chat_id = update.message.chat_id

    if chat_id not in ADMINS:
        update.message.reply_text('Только администраторы могут изменять режим бота.')
        return

    
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
    dp.add_handler(CommandHandler("mode", change_mode, pass_args=True))
    dp.add_handler(CommandHandler("sub", subscribe))
    dp.add_handler(CommandHandler("unsub", unsubscribe))
    dp.add_handler(CommandHandler("subscribers", print_subscribers))

    dp.add_handler(PreCheckoutQueryHandler(precheckout_callback))

    dp.add_handler(
        MessageHandler(Filters.successful_payment, successful_payment_callback)
    )

    
    print('Starting bot...')

    updater.start_polling()

