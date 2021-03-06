from django.shortcuts import render
from .models import Exercise
from django.core import serializers

def home(request):
    context = {
        'exercises': serializers.serialize("json", Exercise.objects.all())
    }
    return render(request, 'home/index.html', context)
