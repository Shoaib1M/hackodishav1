# noicelens_ml-service/utils.py

from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
import os
import matplotlib
matplotlib.use('Agg')

UPLOAD_DIR = "uploads"
STATIC_DIR = "static/charts"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)


def save_uploaded_file(file_storage):
    filename = secure_filename(file_storage.filename)
    filepath = os.path.join(UPLOAD_DIR, filename)
    file_storage.save(filepath)
    return filepath


def plot_pie_chart(top_classes, filename):
    if not top_classes:
        return None
    labels = [cls for cls, _ in top_classes]
    sizes = [val for _, val in top_classes]

    fig, ax = plt.subplots(figsize=(8, 6))
    ax.pie(sizes, labels=labels, autopct='%1.1f%%',
           startangle=140, textprops={'fontsize': 9})
    ax.axis('equal')

    path = os.path.join(STATIC_DIR, filename)
    plt.savefig(path, bbox_inches='tight')
    plt.close(fig)
    return path