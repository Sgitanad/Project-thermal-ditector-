from django.shortcuts import render
from django.http import JsonResponse
from core.models import ThermalData

def dashboard(request):
    return render(request, 'core/dashboard.html')

def api_latest_data(request):
    data = ThermalData.objects.last()
    if not data:
        return JsonResponse({})

    return JsonResponse({
        "temperature": data.temperature,
        "humidity": data.humidity,
        "pressure": data.pressure,
        "time": data.created_at.strftime("%H:%M:%S")
    })
"""
from core.models import ThermalData
ThermalData.objects.create(
    temperature=25.0,
    humidity=60.0,
    pressure=1012.0
)
"""
"""data = {
        "temperature": 28.5,
        "humidity": 55,
        "pressure": 1008,
        "time": "12:00:00"
    }
    return JsonResponse(data)"""



