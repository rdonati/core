from django.db import models

class Exercise(models.Model):
    class TargetArea(models.IntegerChoices):
        UPPER = 1
        LOWER = 2
        GENERAL = 3
        OBLIQUE = 4

    class Difficulty(models.IntegerChoices):
        EASY = 1
        MEDIUM = 2
        HARD = 3
        EXTREME = 4

    name = models.CharField(max_length=25)
    description = models.TextField(null=True,blank=True)
    target_area = models.IntegerField(choices=TargetArea.choices)
    difficulty = models.IntegerField(choices=Difficulty.choices)

    def __str__(self):
        return self.name


