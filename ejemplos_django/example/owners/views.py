from django.shortcuts import render

from guardian.shortcuts import assign_perm
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework import status
from django.core.exceptions import PermissionDenied

from permissions.services import APIPermissionClassFactory
from owners.models import Owner
from owners.serializers import OwnerSerializer

class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    permission_classes = (
        APIPermissionClassFactory(
            name='OwnerPermission',
            permission_configuration={
                'bases':{
                    'create': True,
                    'list': True,   
                },
                'instance': {
                    'retrieve': True,
                    'desrtoy': True,
                    'update': True,
                    'partial_update': True,
                    'delete': True,
                }
            },
        ),
    )