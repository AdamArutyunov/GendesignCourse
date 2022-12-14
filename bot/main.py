import os
import time

from dotenv import load_dotenv
from telegram import LabeledPrice
from telegram.ext import CommandHandler, MessageHandler, Updater, Dispatcher, PreCheckoutQueryHandler, Filters


load_dotenv()

TOKEN = os.getenv('TOKEN')
PAYMENT_PROVIDER_TOKEN = os.getenv('PROVIDER_TOKEN')
PROMOCODE_PRICES = {
    'park': 5500,
    'test': 100,
    None: 7500,
}
SUCCESS_LINK = 'https://t.me/+PsBgiiSkBuJhMGUy'


def send_invoice(update, context):
    """Sends an invoice without shipping-payment."""
    args = context.args

    chat_id = update.message.chat_id
    title = "Курс генеративного дизайна"
    description = "Доступ к курсу генеративного дизайна https://course.genclub.club.\n\nПосле оплаты бот пришлёт ссылку на вступление в телеграм-чат. Если что-то пошло не так, напишите @adam_arutyunov.\n\n "
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



if __name__ == '__main__':
    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher

    print('Bot initialized.')

    dp.add_handler(CommandHandler("start", send_invoice, pass_args=True))

    dp.add_handler(PreCheckoutQueryHandler(precheckout_callback))

    dp.add_handler(
        MessageHandler(Filters.successful_payment, successful_payment_callback)
    )

    
    print('Starting bot...')

    updater.start_polling()

